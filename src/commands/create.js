const program = require("commander");
const chalk = require("chalk");
const ncp = require("ncp");
const { promisify } = require("util");
const my_path = require("../path");

// import execa from "execa";
const Listr = require("listr");
const execa = require("execa");
const { executeExeca } = require("../utils/common");

program
  .command("create <lang> <project_name>")
  .option("-g, --git", "Initializing Git Repo")
  .option("-i, --install", "Install Repository")
  .option("-r, --open", "Open Project")
  .description("Create Template")
  .action(async (lang, project_name, cmdObj) => {
    if(lang == "nest"){
      await nestPrismaGenerate(project_name);
      process.exit();
    }
    
    const tasks = new Listr([]);

    tasks.add({
      title: "Copy Project Files",
      task: () => copyFiles(lang, project_name),
    });
    if (cmdObj.git)
      tasks.add({
        title: "Git Init",
        task: () => gitInit(),
      });
    if (cmdObj.install) {
      tasks.add({
        title: "Install Dependencies",
        task: () => projInstall(),
      });
    }
    if (cmdObj.open) {
      tasks.add({
        title: "Open Project in VSCode",
        task: () => openProject(),
      });
    }
    await tasks.run().catch((err) => {
      console.error(err);
    });
    console.log(chalk.bold.green("DONE"));
    process.exit();
  });

async function copyFiles(lang, project_name) {
  const copy = promisify(ncp);
  const destination = project_name
    ? my_path.projectPath(project_name)
    : my_path.des;
  return copy(my_path.create_src(lang), destination || my_path.des, {
    clobber: false,
  });
}

async function gitInit() {
  const result = await execa("git", ["init"]);
  if (result.failed) {
    return Promise.reject(new Error("Failed to initiate Git"));
  }
  return;
}

async function projInstall() {
  const result = await execa("npm", ["install"]);
  if (result.failed) {
    return Promise.reject(new Error("Failed to install package"));
  }
  return;
}

async function openProject() {
  const result = await execa("code", ["."]);
  if (result.failed) {
    return Promise.reject(
      new Error("code cli not found in environmental variable")
    );
  }
  return;
}

const nestPrismaGenerate = async (projectName) => {

  //TODO: Give user option to choose between npm and yarn

  const tasks = new Listr([]);
  tasks.add({
    title: "Creating Nest Project",
    task: () =>
      executeExeca({
        command: "nest",
        args: ["new", projectName, "--package-manager", "yarn"],
      }),
  });

  tasks.add({
    title: "Installing prisma, passport-jwt, validators etc",
    task: () =>
      executeExeca({
        command: "yarn",
        args: [
          "add",
          "@prisma/client",
          "@types/passport-jwt",
          "class-validator",
          "class-transformer",
          "@nestjs/config",
          "@nestjs/passport",
          "passport",
          "@nestjs/jwt",
          "passport-jwt",
        ],
        folder: projectName,
      }),
  });

  tasks.add({
    title: "Installing Dev Dependencies",
    task: () =>
      executeExeca({
        command: "yarn",
        args: ["add", "-D", "prisma", "@types/passport-jwt"],
        folder: projectName,
      }),
  });

  tasks.add({
    title: "Fetching Template",
    task: () => copyFiles("nest", projectName),
  });

  tasks.add({
    title: "Opening VSCode",
    task: () => executeExeca({ command: "code", args: [projectName] }),
  });

  await tasks.run().catch((err) => {
    // console.error(err);
  });

};
