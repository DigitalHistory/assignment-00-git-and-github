// require modules
const path = require('path'),
      fs=require('fs'),
      util=require('util'),
      urlExists = require('url-exists');

// let urlVal = async(data) => {
//   try {
//     const result = await urlExists(data);
//     console.log(`Result for ${data} is ${result}`);
//   } catch(err) {
//     console.log(err);
//   }
// };

let urlVal = url => new Promise((resolve, reject) => 
  urlExists(url, (err, exists) => err ? reject(err) : resolve(exists)));

// create empty array to hold students
const studentArray = new Array();

/**
 * recursively reads in json files and assembles it in allstudents.json
 * @todo: parse secret info and move somewhere else
 * @todo: consider adding git hook to od this automatially
 */
async function readAll(startPath,filter){
  let jsonContent, contents;

  if (!fs.existsSync(startPath)){
    console.log('no dir ',startPath);
    return;
  }

  var files=fs.readdirSync(startPath);
  for(var i=0;i<files.length;i++){
    var filename=path.join(startPath,files[i]);
    var stat = fs.lstatSync(filename);
    if (stat.isDirectory()){
      readAll(filename,filter); //recurse
    }
    else if (filename.indexOf(filter)>=0) {
      contents = fs.readFileSync(filename);
      // Define to JSON type
      jsonContent = JSON.parse(contents);
      studentArray.push(await(sanitizeJSON(jsonContent)));
    }
  }
  fs.writeFile('utils/allstudents.js', 'const studentsArray= ' + JSON.stringify(studentArray, null, 2) + ';', function(err) {
    if(err) {
      return console.log(err);
    } else
    {
      return console.log('utils/allstudents.js successfully written');}
    
  });
}

function iexist (path) {
  // console.log(path);
  rv = fs.existsSync(path);
  // console.log ("return vlaue is " + rv);
  return rv;
}

/**
 * clean up private info
 */
async function sanitizeJSON (s) {
  let p = {};
  if (!s.privateName) {
    p.firstName = s.firstName;
    p.lastName = s.lastName;
  } else {
    p.firstName = '';
    p.lastName = '';
  }
  p.nickName = s.nickName;
  p.privateName = s.privateName;
  if (! s.privatePicture) {
    // p.picture = (false  | false) ? "true" : "false";
    // p.picture = (iexist(s.picture) || urlVal(s.picture).then(exists  => {console.log("urlval was called on " + s.picture); return exists;})) ? s.picture : '';
    p.picture = (iexist(s.picture) || s.picture.substring(0,4) == "http" ) ? s.picture : '';
  } else {
    p.picture = '';
  }
  p.privateName = s.privateName;
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

readAll('students','.json');

// console.log(studentArray);

// jsObj = {"students": studentArray};
// fs.writeFile("utils/allstudents.json", JSON.stringify(jsObj), function(err) {
//   if(err) {
//     return console.log(err);
//   }
// });

