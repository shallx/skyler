const program = require("commander");
const { getRepos, searchRepos } = require("../api");
const ora = require("ora");
const inquirer = require('inquirer');
const chalk = require("chalk");


program
  .command("git <action> [val]")
  .option("-a, --all", "all repos")
  .option("-u, --private", "user repos")
  .option("-p, --public", "org repos")
  .option("-g, --generate [name]", "Generate for user")
  .option("-c, --clone [name]", "Clone repo")
  .description("Github api")
  .action(async (action, val, opt) => {
    const act = action.toLowerCase();
    const v = val?.toLowerCase() || undefined;
    if (act === "repos") {
      await getGitRepos(v, opt);
    } else if (act === "search") {
      await getGitSearch(v, opt);
    } else {
      console.log("Invalid action");
    }
    process.exit();
  });

const getGitRepos = async (val, opt) => {
  // Loading Spinner
  const spinner = ora("Fetching Repos...").start();

  // await new Promise((resolve) => setTimeout(resolve, 3000));
  const repos = await getRepos(opt);
  spinner.stop();
  console.log(repos);
};

const getGitSearch = async (val, opt) => {
  // Loading Spinner
  const spinner = ora("Searching Repos...").start();

  // await new Promise((resolve) => setTimeout(resolve, 3000));
  const repos = await searchRepos(val, opt);
  spinner.stop();
  console.log(repos)
  if((repos && repos.length > 0) && (opt.generate || opt.clone)){
    let option = opt.generate ? 'generate' : 'clone';

    const answers = await inquirer.prompt([
      {
        type: 'list',
        name: 'repo',
        message: `Select a repo to ${option}`,
        choices: repos
      }
    ])

    let usr;
    if(opt.generate == true || opt.clone == true) usr = 'shallx'
    else usr = opt.generate || opt.clone

    if(opt.generate) {
      console.log(chalk.bold.blueBright('git remote add origin ' + `git@github.com-${usr}:${answers.repo}.git`))
    } else {
      console.log(chalk.bold.blueBright('git clone ' + `git@github.com-${usr}:${answers.repo}.git`))
    }


  } else {
    console.log(repos);
  }
  
};
