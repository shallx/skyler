#! /usr/bin/env node
const program = require("commander");
const chalk = require("chalk");

const ncp = require("ncp");
const { promisify } = require("util");
const my_path = require("./src/path");
const fs = require("fs");

// import execa from "execa";
const Listr = require("listr");
const execa = require("execa");
require("dotenv").config();

program.version("1.0.0").description(`${chalk.bold.blue("Rahi's personal CLI Assistant")} ${chalk.bold.magentaBright.underline("The SKYLER")}`);

program
  .command("create <lang> <subs>")
  .option("-g, --git", "Initializing Git Repo")
  .option("-i, --install", "Install Repository")
  .option("-r, --open", "Open Project")
  .description("Create Template")
  .action(async (lang, subs, cmdObj) => {
    const tasks = new Listr([]);
    tasks.add({
      title: "Copy Project Files",
      task: () => copyFiles(lang,subs),
    });
    if (cmdObj.git)
      tasks.add({
        title: "Git Init",
        task: () => gitInit(),
      });
    if (cmdObj.install) {
      tasks.add({
        title: "Install Dependencies",
        task: () => projInstall(),
      });
    }
    if (cmdObj.open) {
      tasks.add({
        title: "Open Project in VSCode",
        task: () => openProject(),
      });
    }
    await tasks.run().catch(err => {
      console.error(err);
    });
    console.log(chalk.bold.green("DONE"));
    process.exit();
  });

  
program.command("say <name> <age>").action((name, age) => {
  console.log("Hello Mr." + name + ". Your age is " + age);
  process.exit();
});

// Convert these to a barrel export file
require('./src/commands/fetch');

if(process.platform === "win32") require('./src/commands/open');
else if(process.platform === "darwin") require('./src/commands/open_mac');

require('./src/commands/task');

require('./src/commands/git');

program.parse(process.argv);

// const copyFiles = async () => {
//   return copy(my_path.src("//node"), my_path.des, { clobber: false });
// };
async function copyFiles(lang, subs) {
  const copy = promisify(ncp);
  return copy(my_path.create_src(lang), my_path.des, { clobber: false });
}

async function gitInit() {
  const result = await execa("git", ["init"]);
  if (result.failed) {
    return Promise.reject(new Error("Failed to initiate Git"));
  }
  return;
}

async function projInstall() {
  const result = await execa("npm", ["install"]);
  if (result.failed) {
    return Promise.reject(new Error("Failed to install package"));
  }
  return;
}

async function openProject() {
  const result = await execa("code", ["."]);
  if (result.failed) {
    return Promise.reject(
      new Error("code cli not found in environmental variable")
    );
  }
  return;
}