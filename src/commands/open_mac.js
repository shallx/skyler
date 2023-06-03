const program = require("commander");
const { exec, execSync } = require("node:child_process");
const progs = require("../configs/progs_m2");
const chalk = require("chalk");
const { executeCommand } = require("../utils/common");

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
  .action(async(val) => {
    // const output = execSync(`start ~/.ssh`, {stdio: 'inherit'});
    const result = await executeCommand({command: "IF EXIST README.mds echo true"});
    console.log(result[4]);
    if(result.trim() === "true") console.log("true");
    else console.log("false");
    // const v = val.toLowerCase();
    // const path= progs[v];
    // if(!path) {
    //     console.error(notMatched);
    //     process.exit()
    // }
    // exec(`open ${path}`, (err, output) => {
    //   if (err) {
    //     console.error("coud not execute command");
    //     return;
    //   }
    // });
  });
