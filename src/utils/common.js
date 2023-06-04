const util = require("util");
const exec = util.promisify(require("child_process").exec);
const { execSync } = require("node:child_process");
const ora = require("ora");
const PATH = require("path");
const chalk = require("chalk");
const execa = require("execa");

const sleepy = (msec) =>
  new Promise((resolve, _) => {
    setTimeout(resolve, msec);
  });

const executeListOfCommands = async (arry) => {
  try {
    arry.forEach(async (e) => {
      await executeCommand(e);
    });
  } catch (error) {
    console.log(error);
  }
};

// Executues a single command
 // path, folder and message are optional
const executeCommand = async ({ command, folder, path, message }) => {
  return new Promise(async (resolve, reject) => {
    // finding execution path
    let _path = process.cwd();
    if (path) _path = path;
    else if (folder) _path = PATH.join(_path, folder);

    try {
      // Running main command
      const result = execSync(command, { cwd: _path });

      // if message is provided, then print it
      if (message) console.log(chalk.bold.green("✓ ") + message);
      resolve(result.toString());
    } catch (error) {
      // if error occurs, reject the promise
      console.log(error);
      reject(error);
    }
  });
};

const installDepencencies = async ({ folder }) => {
  const platform = process.platform;
  let depencencyType = null;

  // based on platform, check which depencency installer type is present
  if (platform === "win32") {
    let result = await executeCommand({
      command: "IF EXIST package-lock.json echo true",
      folder,
    });
    if (result.trim() === "true") depencencyType = "npm";
    result = await executeCommand({
      command: "IF EXIST yarn.lock echo true",
      folder,
    });
    if (result.trim() === "true") depencencyType = "yarn";
    result = await executeCommand({
      command: "IF EXIST pubspec.yaml echo true",
      folder,
    });
    if (result.trim() === "true") depencencyType = "flutter";
  } else if (platform === "darwin") {
    let result = await executeCommand({
      command: '[[ -f package-lock.json ]] && echo "This file exists!"',
      folder,
    });
    if (result.trim() === "This file exists!") depencencyType = "npm";
    result = await executeCommand({
      command: '[[ -f yarn.lock ]] && echo "This file exists!"',
      folder,
    });
    if (result.trim() === "This file exists!") depencencyType = "yarn";
    result = await executeCommand({
      command: '[[ -f pubspec.yaml ]] && echo "This file exists!"',
      folder,
    });
    if (result.trim() === "This file exists!") depencencyType = "flutter";
  }

  // if no depencency installer type is found, then return
  if (!depencencyType) return;

  // install depencencies
  const spinner = ora("Installing dependencies...").start();
  if (depencencyType === "npm") {
    await executeExeca({
      command: "npm",
      args: ["install"],
      folder,
      loadingMessage: "Running npm install...",
    });
  } else if (depencencyType === "yarn") {
    await executeExeca({
      command: "yarn",
      args: ["install"],
      folder,
      loadingMessage: "Running yarn install...",
    });
  } else if (depencencyType === "flutter") {
    await executeExeca({
      command: "flutter",
      args: ["pub", "get"],
      folder,
      loadingMessage: "Running flutter pub get...",
    });
  }
  spinner.stop();
  console.log(chalk.bold.green("✓ ") + "Dependencies installed");
};


// Based on type of platform, check if directory exists
const checkIfDirectoryExists = async (path) => {
  try {
    const platform = process.platform;
    let result = null;
    if (platform === "win32") {
      result = await executeCommand({
        command: "IF EXIST " + path + " echo true",
      });
      return result.trim() === "true";
    } else if (platform === "darwin") {
      result = await executeCommand({
        command: "[[ -f " + path + " ]] && echo true",
      });
      return result.trim() === "true";
    }
  } catch (error) {
    console.log(error);
  }
};

const executeExeca = async ({
  command,
  args, // array
  path,
  folder,
  loadingMessage,
  successMessage,
}) => {
  // finding execution path
  let _path = process.cwd();
  if (path) _path = path;
  else if (folder) _path = PATH.join(_path, folder);

  // Loader
  let spinner;
  if (loadingMessage) spinner = ora(loadingMessage).start();

  // Running main command
  const result = await execa(command, args, { cwd: _path });

  // Stopping loader
  if (spinner) spinner.stop();

  if (result.failed) {
    console.log(chalk.bold.red("✗ ") + "Some error occured!");
  } else {
    // if Sucess message is provided, then print it
    if (successMessage) console.log(chalk.bold.green("✓ ") + successMessage);
  }
  return;
};

module.exports = {
  sleepy,
  executeCommand,
  executeListOfCommands,
  installDepencencies,
  checkIfDirectoryExists,
  executeExeca,
};
