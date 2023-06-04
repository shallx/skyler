const program = require("commander");
const { getRepos, searchRepos } = require("../api");
const ora = require("ora");
const inquirer = require("inquirer");
const chalk = require("chalk");
const Listr = require("listr");
const {
  executeListOfCommands,
  installDepencencies,
  executeCommand,
  checkIfDirectoryExists,
  executeExeca,
} = require("../utils/common");

program
  .command("git <action> [val]")
  .option("-a, --all", "all repos")
  .option("-u, --private", "user repos")
  .option("-p, --public", "org repos")
  .option("-r, --remote [name]", "Generate Remote link")
  .option("-c, --clone [name]", "Clone repo")
  .option("-e, --execute", "Execute the command")
  .option("-d, --dependencies", "Install dependencies")
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

  const repos = await searchRepos(val, opt);
  spinner.stop();

  if (repos && repos.length > 0 && (opt.remote || opt.clone)) {
    const tasks = new Listr([]);
    let option = opt.remote ? "generate remote url" : "clone";
    let usr;
    if (opt.remote == true || opt.clone == true) usr = "shallx";
    else usr = opt.remote || opt.clone;

    console.log("\n");
    // Propmt user to select a repo
    const answers = await inquirer.prompt([
      {
        type: "list",
        name: "repo",
        message: `Select a repo to ${option}`,
        choices: repos,
      },
    ]);
    const convertedRepo = `git@github.com-${usr}:${answers.repo}.git`;

    if (opt.remote) {
      if (usr == "shallx" && opt.execute) {
        tasks.add({
          title: "Linking with Remote URL",
          task: () =>
            executeExeca({
              command: "git",
              args: ["remote", "add", "origin", convertedRepo],
            }),
        });

        await tasks.run().catch((err) => {
          // console.log(err.toString());
        });
      } else {
        console.log(
          chalk.bold.blueBright("git remote add origin " + convertedRepo)
        );
      }
    } else {

      if (opt.execute) {
        // if folderName already exists, then stop execution
        const folderName = answers.repo.split("/")[1];
        const directoryExist = await checkIfDirectoryExists(folderName);
        if (directoryExist) {
          console.log(chalk.bold.red("✗ ") + "Folder already exists!");
          process.exit();
        }

        // Adding task for cloaning repo
        tasks.add({
          title: "Cloaning Repo",
          task: () =>
            executeExeca({
              command: "git",
              args: ["clone", convertedRepo],
            }),
        });

        // Adding task for configuring user name
        
        tasks.add({
          title: "Configuring user name",
          task: () =>
            executeExeca({
              command: "git",
              args: ["config", "user.name", "Rafat Rashid Rahi"], //TODO: Change hard coded name
              folder: folderName,
            }),
        });

        // Adding task for configuring user email
        if(usr == "shallx" || usr == "rahi-staff"){
          const email = usr == "shallx" ? "rafat.rashid247@gmail.com" : "rafatrahi@staffasia.org";

          
          tasks.add({
            title: "Configuring Email",
            task: () =>
              executeExeca({
                command: "git",
                args: ["config", "user.email", email],
                folder: folderName,
              }),
          });
        }
        

        // Adding task for installing dependencies
        if (opt.dependencies) {
          tasks.add({
            title: "Installing Dependencies",
            task: () => installDepencencies({ folder: folderName }),
          });
        }

        // Adding task for opening VSCode
        tasks.add({
          title: "Opening VSCode",
          task: () => executeExeca({ command: "code", args: [folderName] }),
        });

        // Running all tasks
        await tasks.run().catch((err) => {
          console.error(err);
        });
        console.log(chalk.bold.green("✓") + " Cloned Successfully!");
      } else {
        console.log(chalk.bold.blueBright("git clone " + convertedRepo));
      }
    }
  } else {
    console.log(repos);
  }
};
