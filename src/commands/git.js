const program = require("commander");
const progs = require("../progs");
const Shell = require("node-powershell");
const { getRepos } = require("../api");

const ps = new Shell({
  executionPolicy: "Bypass",
  noProfile: true,
});

program
  .command("git <action> [val]")
  .option("-a, --all", "all repos")
  .option("-p, --private", "user repos")
  .option("-c, --public", "org repos")
  .description("Github api")
  .action(async (action, val, opt) => {
    const act = action.toLowerCase();
    if(act === 'repos'){
        // show loading spinner while waiting for response
        
        const repos = await getRepos(opt);
        console.log(repos);
    } else {
        console.log("Invalid action");
    }
    process.exit();
    // val = val.toLowerCase();
    // ps.addCommand(`start ${progs[val]}`);
    // ps.invoke()
    //   .then(res => {
    //     process.exit();
    //   })
    //   .catch(err => {
    //     console.log(`${chalk.cyanBright(val)} does not match with any program`);
    //     process.exit();
    //   });
  });