const {firebase_config, firebase_path} = require('./config'),
  firebase = require('firebase'),
  exec = require('child_process').exec;
  
  firebase.initializeApp(firebase_config);
  const database = firebase.database().ref().child(firebase_path);

  function saveData (ref, data) {
    return database.child(ref).set(data);
  }

function errorHandler (err) {
    console.error('exec error: ' + err);
}

function execHandler (cmd) {
    return new Promise ((resolve, reject) => {

        exec(cmd, function(error, stdout, stderr) {
            if (error) {
                reject(error);
            } else {
                resolve(stdout);
            }
        });
        
    })
}

module.exports = {execHandler, errorHandler, saveData}