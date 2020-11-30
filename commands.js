#! /usr/bin/env node
const program = require("commander");
const Shell = require("node-powershell");
const chalk = require("chalk");
const progs = require("./progs");
const ncp = require("ncp");
const { promisify } = require("util");
const path = require("./path");
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
  .option("--git", "-g", "Initializing Git Repo")
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
    await tasks.run().catch(err => {
      console.error(err);
    });
    console.log(chalk.bold.green("DONE"));
    process.exit();
  });

program
  .command("fetch <lang>")
  .option("--model <name>", "-m", "fetching model")
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
//   return copy(path.src("//node"), path.des, { clobber: false });
// };
async function copyFiles() {
  const copy = promisify(ncp);
  return copy(path.src("//node"), path.des, { clobber: false });
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
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function fetch_files(lang, cmdObj) {
  const n_lang = lang.toLowerCase();
  const schema_name = cmdObj.model.toLowerCase();
  const model_name = capitalize(schema_name);

  if (n_lang == "node") {
    const temp = fs.readFileSync(path.src("//node//Model/model.txt"));
    const template = handlebars.compile(temp.toString());
    const data = template({ model_name, schema_name });
    fse
      .outputFile("Model/" + cmdObj.model + ".js", data)
      .then(() => {
        process.exit();
      })
      .catch(err => {
        console.log(err);
      });
  }
}
