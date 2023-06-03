const util = require('util');
const exec = util.promisify(require('child_process').exec);
const {execSync} = require("node:child_process")
const ora = require("ora");
const PATH = require("path");
const chalk = require('chalk');
const execa = require('execa');

const sleepy = (msec) =>
  new Promise((resolve, _) => {
    setTimeout(resolve, msec);
  });

const executeListOfCommands = async (arry) => {
  try {
    console.log("Executing command...");
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
// e = { command: "ls", path: "c:/users", folder: "test", message: ""} // path and folder are optional
const executeCommand = async ({command, folder, path, message}) => {

  return new Promise(async (resolve, reject) => {
    let _path = process.cwd();
    if(path) _path = path;
    else if(folder) _path = PATH.join(_path, folder);
    
    try {
      const result = execSync(command, {cwd: _path});
      if(message) console.log(chalk.bold.green("✓ ") + message);
      resolve(result.toString());
    } catch (error) {
      console.log(error);
      reject(error);
    }

  });
};

const installDepencencies = async ({folder}) => {
  const platform = process.platform;
  let depencencyType = null;
  console.log("Platform: ", platform);
  if(platform === "win32") {
    let result = await executeCommand({command: "IF EXIST package-lock.json echo true", folder});
    if(result.trim() === "true") depencencyType = "npm";
    result = await executeCommand({command: "IF EXIST yarn.lock echo true", folder});
    if(result.trim() === "true") depencencyType = "yarn";
    result = await executeCommand({command: "IF EXIST pubspec.yaml echo true", folder});
    if(result.trim() === "true") depencencyType = "flutter";
  } else if(platform === "darwin"){
    let result = await executeCommand({command: "[[ -f package-lock.json ]] && echo \"This file exists!\"", folder})
    if(result.trim() === "This file exists!") depencencyType = "npm";
    result = await executeCommand({command: "[[ -f yarn.lock ]] && echo \"This file exists!\"", folder})
    if(result.trim() === "This file exists!") depencencyType = "yarn";
    result = await executeCommand({command: "[[ -f pubspec.yaml ]] && echo \"This file exists!\"", folder})
    if(result.trim() === "This file exists!") depencencyType = "flutter";
  }

  console.log("Depencency type: ", depencencyType);
  if(!depencencyType) return;
  const spinner = ora("Installing dependencies...").start();
  if(depencencyType === "npm") {
    await executeCommand({command: "npm install", folder});
  }
  else if(depencencyType === "yarn") {
    await executeCommand({command: "yarn install", folder});
  }
  else if(depencencyType === "flutter") {
    await executeCommand({command: "flutter pub get", folder});
  }
  spinner.stop();
  console.log(chalk.bold.green("✓ ") + "Dependencies installed");


}

const checkIfDirectoryExists = async (path) => {
  try {
    const platform = process.platform;
    let result = null;
    if(platform === "win32") {
      result = await executeCommand({command: "IF EXIST "+ path +" echo true"});
      return result.trim() === "true";
    } else if(platform === "darwin"){
      result = await executeCommand({command: "[[ -f "+ path +" ]] && echo true"})
      return result.trim() === "true";
    }
  } catch (error) {
    console.log(error);
  }
};

async function executeExeca() {
  const result = await execa("npm", ["install"]);
  if (result.failed) {
    return Promise.reject(new Error("Failed to install package"));
  }
  return;
}


module.exports = {
  sleepy,
  executeCommand,
  executeListOfCommands,
  installDepencencies,
  checkIfDirectoryExists,
  executeExeca,
}