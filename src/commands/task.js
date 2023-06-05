const api = require("../api");
const program = require("commander");
const inquirer = require('inquirer');
const chalk = require('chalk');
const ora = require("ora");


program
  .command("task")
  .option("-a, --add <task>", 'Add task')
  .option("-r, --remove", "Remove task")
  .option("-l, --list", "List tasks")
  .option("-m, --move", "Move task to done")
  .option("-d, --desc <desk>", "Description for created card")
  .description("Trello task management")
  .action(async(obj) => {
    try {
      let result = null;
      if(obj.add){
        const spinner = ora("Adding task").start();
        result = await api.createCard(obj.add);
        spinner.stop();
        if(obj.desc) result = await api.updateCard(result, obj.desc);
        else result = "Task added Successfully!!!";
      }
      if(obj.list){
        let list_id = await getListId();
        const spinner = ora("Loading Tasks").start();
        let tasks = await api.getCards(list_id)
        spinner.stop()
        tasks.map((task, index) => console.log(index+1+ '. '+chalk.cyanBright(task.name)));
        console.log(chalk.bold.green("✓") + " Loaded Tasks Successfully!");
        process.exit();
      }
      if(obj.remove){
        const loading = ora("Loading tasks").start() 
        let list_id = await getListId();
        let cards = await api.getCards(list_id)
        loading.stop();
        let answers = await inquirer
          .prompt([
            {
              type: 'list',
              name: 'task',
              message: 'Select a task to remove?',
              choices: cards.map((val) => val.name),
            },
          ]);
        let id;
        cards.forEach((card) => {
          if(card.name == answers.task){
            id = card.id;
          }
        });
        loading = ora("Removing Tasks").start();
        result = await api.removeCard(id);
        loading.stop();
        console.log(chalk.bold.green("✓") + " Removed Task Successfully!");
      }
      if(obj.move){
        let cards = await api.getCards()
        let answers = await inquirer
          .prompt([
            {
              type: 'list',
              name: 'task',
              message: 'Select Completed Task',
              choices: cards.map((val) => val.name),
            },
          ]);
        let id;
        cards.forEach((card) => {
          if(card.name == answers.task){
            id = card.id;
          }
        });
        loading = ora("Moving Tasks").start();
        result = await api.moveCard(id);
        loading.stop();
        console.log(chalk.bold.green("✓") + " Moved Task Successfully!");
      }
      
      if(obj.desc && !obj.add) throw Error("--desc || -d should always be used with --add || -a");

    } catch (error) {
      console.log(chalk.redBright(error));
    }
    process.exit();
  });

async function getListId() {
  let getList;
  let list_id;
  try {
    getList = await inquirer.prompt(
      [
        {
          type: 'list',
          name: 'type',
          message: 'Select a type of list',
          choices: Object.keys(api.list)
        }
      ]
    );
    list_id = api.list[getList.type];
    return list_id;

  } catch (error) {
    console.log(error);
    process.exit();
  }
}