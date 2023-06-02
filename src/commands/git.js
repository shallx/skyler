const program = require("commander");
const progs = require("../progs");
const Shell = require("node-powershell");
const { getRepos } = require("../api");
const ora = require("ora");

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
    if (act === "repos") {
      // show loading spinner while waiting for response
      const spinner = ora("Fetching Repos...").start();

      // await new Promise((resolve) => setTimeout(resolve, 3000));
      const repos = await getRepos(opt);
      spinner.stop();
      console.log(repos);
    }
    else if (act === "search"){
      
    } 
    else {
      console.log("Invalid action");
    }
    process.exit();
  });
