// require modules
// `path` provides some utilities for finding files on your harddrive (or on the web)
// `fs` allows you to access your local hard drive's filesystem
var path = require('path'), fs=require('fs');

// create empty array to hold students
// this array lives in the "global namespace".
// that makes recursion in `readAll` a little bit simpler
var studentArray = new Array();

/**
 * recursively reads in json files and assembles it in allstudents.json
 * @todo: parse secret info and move somewhere else
 * @todo: consider adding git hook to do this automatially
 */
function readAll(startPath,filter){
  // declare variables
  let jsonContent, contents;

  // check to make sure that the startpath variable is a real directory
  if (!fs.existsSync(startPath)){
    console.log('no dir ',startPath);
    return;
  }
  // make a list of all the fles in the start directory
  let files=fs.readdirSync(startPath);
  // loop over the list of files
  for (let i=0;i<files.length;i++){
    // get some info about the current file
    let filename=path.join(startPath,files[i]);
    let stat = fs.lstatSync(filename);

    // recursion: if the current `file` is actually a directory, run the current
    // function using that directory.  
    if (stat.isDirectory()){
      readAll(filename,filter); //recurse
    }
    // otherwise get the info form the 
    else if (filename.indexOf(filter)>=0) {
      contents = fs.readFileSync(filename);
      // read the file and interpret it as a JSON data structure
      jsonContent = JSON.parse(contents);
      // erase all the private data so it doesn't get shown to the public
      studentArray.push(sanitizeJSON(jsonContent));
    }
  }
}

/**
 * clean up private info
 */
function sanitizeJSON (s) {
  let p = {};

  // only record names if it's not private
  if (!s.privateName) {
    p.firstName = s.firstName;
    p.lastName = s.lastName;
  } else {
    p.firstName = '';
    p.lastName = '';
  }
  p.nickName = s.nickName;
  p.privateName = s.privateName;
  // same for the picture
  if (! s.privatePicture) {
    p.picture = s.picture;
  } else {
    p.picture = '';
  }
  p.privatePicture = s.privatePicture;
  // etc. 
  if (! s.privateEmail) {
    p.email = s.email;
  }
  p.privateName = s.privateName;
  if (! s.privateGithub) {
    p.github = s.github;
  }
  p.privateGithub = s.privateGithub;
  p.superpower = s.superpower;
  p.academicinterests = s.academicinterests;
  return p;
}

// above we just defined a couple of  functions, but
// we didn't actually do anything.
// here, we finally "call" the function and do the work. 
readAll('students','.json');

// and now, finally, write the data structure to `utils/allstudents.js`
fs.writeFile('utils/allstudents.js', 'var studentsArray= ' + JSON.stringify(studentArray) + ';', function(err) {
  if(err) {
    return console.log(err);
  } else
  {
    return console.log('utils/allstudents.js successfully written');}
  
});

