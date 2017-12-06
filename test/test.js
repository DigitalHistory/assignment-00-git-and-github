'use strict';

 const path = require('path');
const gitCommits = require('git-commits');

var repoPath = path.resolve(process.env.REPO || (__dirname + '/../.git'));
var ignoreCommitEmails = "matt.price@utoronto.ca";
const matchesProfEmail = function (email, profEmails) {
  return (profEmails.indexOf(email) > -1);
};

var studentCommits = 0,
    minCommits = 4;
var chai=require('chai'),
    expect=chai.expect;
var gitConfig = require('git-config');

/////////////////////////////
///
///  tests start here
///
////////////////////////////

describe('Git Checks', function() {
  var name,email,githubid;

  before(function(done) {
    gitCommits(repoPath)
      .on('data', function (commit) {
        if (!matchesProfEmail(commit.author.email, ignoreCommitEmails))
        {
          studentCommits++;
        }
      })
      .on('end', function () {
        // console.log(studentCommits);
      })
    ;
    done();
  });

  it('There should be at least ' + minCommits + " git commits.", function() {
    expect(studentCommits).to.be.at.least(minCommits);
  });
  it('Git should be configured with username and email information', function() {
    gitConfig(function (err, config) {
      if (err) return done(err);
      if (config.user.name) {name = config.user.name};
      if (config.user.email) {email = config.user.email};
      if (config.github.user) {githubid = config.github.user};
      
      expect(config.user.name, "your Git user name has not been set").not.to.be.undefined;
      expect(config.user.email, "your Git email has not been set").not.to.be.undefined;
      expect(config.github.user, "your Github user name has not been set").not.to.be.undefined;
      
    });
  });
  it('All changes in current directory should be committed to Git (OK for this to fail while you are still working)', function() {
    // need to check git status, find a way to list uncommitted files
  });
});

describe('JSON Checks', function() {
  before(function() {
    // read the JSON file
  });

  it('Text file with title yourgithubid.json should exist in "students" directory', function() {
    var p = `../students/${githubid}.json`;
    expect(p, `I can't find the file ${p}`).to.be.a.file();
  });

  it('JSON file should be valid JSON', function() {
    
  });

  it('JSON file should contain name, email,github, and picture', function() {
    
  });

  
});

describe('Reflection Checks (not required unless you are attempting an "A" grade!)', function() {
  it('Reflection file should exist', function() {
    // expect file to exist, as above
  });
  it('Word coult should be reasonable', function() {
    
  });
});









