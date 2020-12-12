const program = require("commander");
const progs = require("../progs");
const Shell = require("node-powershell");

const ps = new Shell({
  executionPolicy: "Bypass",
  noProfile: true,
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