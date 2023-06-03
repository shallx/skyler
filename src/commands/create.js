
const program = require("commander");
const chalk = require("chalk");
const ncp = require("ncp");
const { promisify } = require("util");
const my_path = require("../path");

// import execa from "execa";
const Listr = require("listr");
const execa = require("execa");

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