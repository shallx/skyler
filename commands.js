#! /usr/bin/env node
const program = require("commander");
const Shell = require("node-powershell");
const chalk = require("chalk");
const progs = require("./progs");

const ps = new Shell({
  executionPolicy: "Bypass",
  noProfile: true,
});

program.version("1.0.0").description("My personal CLI Assistant");

program
  .command("create <val>")
  .description("Just your name")
  .action(val => {
    ps.addCommand(`mkdir ${val}`);
    ps.invoke()
      .then(res => {
        console.log(res);
      })
      .catch(err => {
        console.log(err);
      });
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
