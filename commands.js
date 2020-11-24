#! /usr/bin/env node
const program = require("commander");
const Shell = require("node-powershell");
const chalk = require("chalk");

const ps = new Shell({
  executionPolicy: "Bypass",
  noProfile: true,
});

program.version("1.0.0").description("Mojar lagi banaiyar");

const startMenu_appdata =
  'C:\\Users\\"Rafat Rashid"\\AppData\\Roaming\\Microsoft\\Windows\\"Start Menu"\\Programs\\';
const startmenu_programdata =
  'C:\\ProgramData\\Microsoft\\Windows\\"Start Menu"\\Programs\\';

const progs = {
  anydesk: startmenu_programdata + 'AnyDesk\\"AnyDesk".lnk',
  compass: startMenu_appdata + '"MongoDB Inc"\\"MongoDBCompass".lnk',
  vscode: startMenu_appdata + '"Visual Studio Code"\\"Visual Studio Code".lnk',
};
console.log(progs["compass"]);

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
        // console.log(err);
        console.log(`${chalk.cyanBright(val)} does not match with any program`);
        process.exit();
      });
  });

program.parse(process.argv);
// process.exit();
