#! /usr/bin/env node
const program = require("commander");
const Shell = require("node-powershell");
const chalk = require("chalk");
const progs = require("./progs");
const ncp = require("ncp");
const { promisify } = require("util");
const my_path = require("./path");
const path = require("path");
const fs = require("fs");
const fse = require("fs-extra");
const handlebars = require("handlebars");

// import execa from "execa";
const Listr = require("listr");
const { projectInstall } = require("pkg-install");
const execa = require("execa");
const { log } = require("console");

const ps = new Shell({
  executionPolicy: "Bypass",
  noProfile: true,
});

program.version("1.0.0").description("My personal CLI Assistant");

program
  .command("create <lang> <subs>")
  .option("-g, --git", "Initializing Git Repo")
  .option("-i, --install", "Install Repository")
  .description("Create Template")
  .action(async (lang, subs, cmdObj) => {
    const tasks = new Listr([]);
    tasks.add({
      title: "Copy Project Files",
      task: () => copyFiles(),
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
    await tasks.run().catch(err => {
      console.error(err);
    });
    console.log(chalk.bold.green("DONE"));
    process.exit();
  });

program
  .command("fetch <lang>")
  .option("-m, --model <name>", "Fetching model")
  .option("-c, --controller <name>", "Fetch Controller")
  .option("-mrc, --mrc_all <name>", "Fetch Model Route Controller")
  .description("Fetch template files")
  .action((lang, cmdObj) => {
    fetch_files(lang, cmdObj);
  });

program.command("say <name> <age>").action((name, age) => {
  console.log("Hello Mr." + name + ". Your age is " + age);
  process.exit();
});

program
  .command("open <val>")
  .description("Open files")
  .action(val => {
    val = val.toLowerCase();
    ps.addCommand(`start ${progs[val]}`);
    ps.invoke()
      .then(res => {
        process.exit();
      })
      .catch(err => {
        console.log(`${chalk.cyanBright(val)} does not match with any program`);
        process.exit();
      });
  });

program.parse(process.argv);

// const copyFiles = async () => {
//   return copy(my_path.src("//node"), my_path.des, { clobber: false });
// };
async function copyFiles() {
  const copy = promisify(ncp);
  return copy(my_path.src("//node"), my_path.des, { clobber: false });
}

async function gitInit() {
  const result = await execa("git", ["init"]);
  if (result.failed) {
    return Promise.reject(new Error("Failed to initiate Git"));
  }
  return;
}

function capitalize(s) {
  if (typeof s !== "string") return "";
  s.toLowerCase();
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function fetch_files(lang, cmdObj) {
  const n_lang = lang.toLowerCase();

  let _src, _des, data;
  switch (n_lang) {
    case "node":
      if (cmdObj.model) {
        data = {
          schema_name: cmdObj.model.toLowerCase(),
          model_name: capitalize(cmdObj.model),
        };
        _src = "//node//Model//model.txt";
        _des = "Model/" + data.schema_name + ".js";
      } else if (cmdObj.controller) {
        data = {
          controller_name: capitalize(cmdObj.controller),
          controller_obj: cmdObj.controller.toLowerCase(),
        };
        _src = "/node/Controller/controller.txt";
        _des = "Controller/" + data.controller_obj + "Controller" + ".js";
      }
      break;
    case "gitignore":
      data = {};
      _src = ".gitignore";
      _des = ".gitignore";
  }
  const temp = fs.readFileSync(my_path.src(_src));
  const template = handlebars.compile(temp.toString());
  const templated_data = template(data);
  fse
    .outputFile(_des, templated_data)
    .then(() => {
      process.exit();
    })
    .catch(err => {
      console.log(err);
    });
}

async function projInstall() {
  const result = await execa("npm", ["install"]);
  if (result.failed) {
    return Promise.reject(new Error("Failed to install package"));
  }
  return;
}
