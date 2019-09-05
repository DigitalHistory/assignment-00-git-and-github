'use strict';

const path = require('path');
const gitCommits = require('git-commits'), fs=require('fs'), hwc=require('html-word-count'),
      gitConfig = require('git-config'), gitState = require('git-state'), jsonLint = require('jsonlint');

const repoPath = path.resolve(process.env.REPO || (__dirname + '/../.git'));
var ignoreCommitEmails = 'matt.price@utoronto.ca';
const matchesProfEmail = function (email, profEmails) {
  return (profEmails.indexOf(email) > -1);
};

var studentCommits = 0,
    minCommits = 2;
var chai=require('chai'),
    expect=chai.expect;
chai.use(require('chai-fs'));

var name,email,githubid;






gitConfig(function (err, config) {
  if (err) return done(err); 
  console.log(config);
  if (config.user.name) { name = config.user.name; }
  if (config.user.email) { email = config.user.email; }
  if (config.github.user) { githubid = config.github.user; }

});

// let f = function () {
//   return console.log('hello');
// };

// f;

// console.log('hello');

/////////////////////////////
///
///  tests start here
///
////////////////////////////

describe('Git Checks', function() {
  var  gitCheck;
  before(function(done) {
    this.timeout(0);
    gitCommits(repoPath) 
      .on('data', function (commit) {
        if (!matchesProfEmail(commit.author.email, ignoreCommitEmails))
        {
          studentCommits++;
        }
      })
      .on('end', function () {
      })
    ;

    gitCheck  = gitState.checkSync('./', function(r,e) {
      //return [r, e];
    });
    done();
  });

  it('You should have made at least ' + minCommits + ' git commits ', function() {
    expect(studentCommits).to.be.at.least(minCommits);
  });

  it('Git should be configured with username and email information', function() {
    expect(name, 'your Git user name has not been set').not.to.be.undefined;
    expect(email, 'your Git email has not been set').not.to.be.undefined;
    expect(githubid, 'your Github user name has not been set').not.to.be.undefined;
  });

  it('All changes in checked-in files should be committed to Git (OK for this to fail while you are still working)', function() {
    expect(gitCheck.dirty, 'looks like you have changed some files and not committed the changes yet').to.equal(0);
  });

  it('All files in current directory should be committed to Git (OK for this to fail while you are still working)', function() {
    expect(gitCheck.untracked, 'looks like you have some files in the directory which have not been added to the repository. \n      Make sure your answers do not rely on them, or tests will fail on the server.').to.equal(0);

  });
});

function jlint(s) {
  try {
    jsonLint.parse(fs.readFileSync(s, 'utf-8'));
  }
  catch (e) {
    return e;
  }
}


describe('JSON Checks', function() {
  before(function() {
    // read the JSON file
  });

  it('Text file with title yourGithubID.json should exist in "students" directory', function() {
    let p = `students/${githubid}.json`;
    expect(p).to.be.a.file();
  });

  it('JSON file should be valid JSON -- please check quotation marks, colons, commas, etc.', function() {
    let p = `students/${githubid}.json`;
    expect(jlint(p), `Do your best to make sense of the error message below. If you have
created a syntax error, the debugger will try to find the mistake, but
often the error will only be detected several lines after its *actual*
source. Be on the lookout especially for mising quotation marks,
commas, braces ("{}"), etc. Often the *closing* parenthsis, brace, or
quotation mark will be missing and cause an error.

`).to.not.be.an('error');
  });

  it('JSON file should contain name, email,github, and picture', function() {
    let j = JSON.parse(fs.readFileSync(`students/${githubid}.json`, 'utf8'));
    expect(j.lastName, 'your JSON file does not record your last name!').to.be.a('string').that.is.not.empty;
    expect(j.firstName, 'your JSON file does not record your first name!').to.be.a('string').that.is.not.empty;
    expect(j.github, 'your gituhubid doesn\'t seem to be recorded properly').to.equal(githubid);
    expect(j.picture, 'your JSON file does not record your picture URL or path').to.be.a('string').that.is.not.empty;
  });


});

describe('Image Checks', function() {

  it('Image file with title yourGithubID.jpg should exist in "images" directory', function() {
    let p = `images/${githubid}.jpg`;
    expect(p).to.be.a.file();
  });

  // todo: do a file type check to be sure it's an image 

});




describe('Reflection Checks (not required unless you are attempting an "A" grade!)', function() {
  it('Reflection file should exist', function() {
    let r = `Reflection/${githubid}.md`;
    expect(r, `I can't find the file ${r}`).to.be.a.file();
  });
  it('The total word count for your reflection should be around 525 (give or take)', function() {
    let content=fs.readFileSync(`Reflection/${githubid}.md`, 'utf-8');
    expect(hwc(content), '').to.be.approximately(525,100);
  });
});
