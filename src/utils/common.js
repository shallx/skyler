const util = require('util');
const exec = util.promisify(require('child_process').exec);
const {execSync} = require("node:child_process")
const ora = require("ora");
const PATH = require("path");

const sleepy = (msec) =>
  new Promise((resolve, _) => {
    setTimeout(resolve, msec);
  });

const executeListOfCommands = async (arry) => {
  try {
    console.log("Executing command");
    arry.forEach(async (e) => {
      const spinner = ora("Executing command:"+ e.command+ "\n");
      await executeCommand(e);
      spinner.stop()
    });
  } catch (error) {
    console.log(error);
  }
};

// Executues a single command
// e = { command: "ls", path: "c:/users", folder: "test"} // path and folder are optional
const executeCommand = async (e) => {

  return new Promise(async (resolve, reject) => {
    let path = process.cwd();
    if(e.path) path = e.path;
    else if(e.folder) path = PATH.join(path, e.folder);
    
    execSync(e.command,{cwd: path}, (err, output) => {
      if (err) { 
        console.log(err);
        reject("could not execute command");
      }
      resolve(true);
    });
  });
};

module.exports = {
  sleepy,
  executeCommand,
  executeListOfCommands,
}