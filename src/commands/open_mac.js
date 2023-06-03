const program = require("commander");
const { exec } = require("node:child_process");
const progs = require("../configs/progs_m2");
const chalk = require("chalk");

const description = `
Open's files or directory
`

const notMatched = `
Did not match with any preset options!
Available options are ${chalk.bold.blue('[dev, flutter, node, react]')}
`;

program
  .command("open <val>")
  .description(description)
  .action((val) => {
    const v = val.toLowerCase();
    const path= progs[v];
    if(!path) {
        console.error(notMatched);
        process.exit()
    }
    exec(`open ${path}`, (err, output) => {
      if (err) {
        console.error("coud not execute command");
        return;
      }
    });
  });
