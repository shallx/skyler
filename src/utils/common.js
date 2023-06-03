const util = require('util');
const exec = util.promisify(require('child_process').exec);
const {execSync} = require("node:child_process")
const ora = require("ora");

const sleepy = (msec) =>
  new Promise((resolve, _) => {
    setTimeout(resolve, msec);
  });

const executeListOfCommands = async (arry) => {
  try {
    console.log("Executing command");
    arry.forEach(async (e) => {
      const spinner = ora("Executing command:", e, "\n");
      await executeCommand(e);
      spinner.stop()
    });
  } catch (error) {
    console.log(error);
  }
};

const executeCommand = async (command) => {
  return new Promise(async (resolve, reject) => {
    
    execSync(command,{cwd: process.cwd()}, (err, output) => {
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