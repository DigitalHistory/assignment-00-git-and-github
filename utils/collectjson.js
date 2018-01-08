// require modules
var path = require('path'), fs=require('fs'), util=require('util');

// create empty array to hold students
var studentArray = new Array();;

/**
 * recursively reads in json files and assembles it in allstudents.json
 * @todo: parse secret info and move somewhere else
 * @todo: consider adding git hook to od this automatially
 */
function readAll(startPath,filter){
  let jsonContent, contents;

  if (!fs.existsSync(startPath)){
    console.log("no dir ",startPath);
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
      studentArray.push(sanitizeJSON(jsonContent));
    };
  };
};

/**
 * clean up private info
 */
function sanitizeJSON (s) {
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
    p.picture = s.picture;
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

fs.writeFile("utils/allstudents.js", "var nativestudents= " + JSON.stringify(studentArray) + ";", function(err) {
  if(err) {
    return console.log(err);
  } else
  {
    return console.log("utils/allstudents.js successfully written")}
  
});

