#! /usr/bin/env node
const program = require("commander");
const chalk = require("chalk");


// import execa from "execa";
const Listr = require("listr");
const execa = require("execa");

require("dotenv").config();

program.version("1.0.0").description(`${chalk.bold.blue("Rahi's personal CLI Assistant")} ${chalk.bold.magentaBright.underline("The SKYLER")}`);


program.command("say <name> <age>").action((name, age) => {
  console.log("Hello Mr." + name + ". Your age is " + age);
  process.exit();
});

require('./src/commands/create')

require('./src/commands/fetch');

require('./src/commands/task');

require('./src/commands/git');

if(process.platform === "win32") require('./src/commands/open');
else if(process.platform === "darwin") require('./src/commands/open_mac');

program.parse(process.argv);
