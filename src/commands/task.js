const api = require("../api");
const program = require("commander");
const inquirer = require('inquirer');
const chalk = require('chalk');


program
  .command("task")
  .option("-a, --add <task>", 'Add task')
  .option("-r, --remove", "Remove task")
  .option("-l, --list", "List tasks")
  .option("-m, --move", "Move task to done")
  .description("Trello task management")
  .action(async(obj) => {
    if(obj.add){
      api.createCard(obj.add).then(result => {
        chalk.blueBright("Task Added Successfully!!!")
        process.exit();
      }).catch(err => {
        console.log(chalk.redBright(err));
        process.exit();
      });
    }
    if(obj.list){
      api.getCards(obj.add)
        .then(tasks => {
          tasks.map((task, index) => console.log(index+1+ '. '+chalk.cyanBright(task.name)));
          process.exit();
        })
        .catch(err => {
          console.log(chalk.redBright(err));
          process.exit();
        })
    }
    if(obj.remove){
      let cardS;
      api.getCards('5fc37294869f4a07606ae4b3')
        .then(cards => {
          cardS = cards;
          return inquirer
          .prompt([
            {
              type: 'list',
              name: 'task',
              message: 'Select a task to remove?',
              choices: cards.map((val) => val.name),
            },
          ])
        })
        .then(async(answers) => {
          let id;
          cardS.forEach((card) => {
            if(card.name == answers.task){
              id = card.id;
            }
          });
          return api.removeCard(id);
        })
        .then(result => {
          chalk.blueBright(result)
          process.exit();
        })
        .catch(err => {
          console.log(chalk.red(err));
          process.exit();
        })
    }
    if(obj.move){
      let cardS;
      api.getCards()
        .then(cards => {
          cardS = cards;
          return inquirer
          .prompt([
            {
              type: 'list',
              name: 'task',
              message: 'Select Completed Task',
              choices: cards.map((val) => val.name),
            },
          ])
        })
        .then(async(answers) => {
          let id;
          cardS.forEach((card) => {
            if(card.name == answers.task){
              id = card.id;
            }
          });
          return api.moveCard(id);
        })
        .then(result => {
          console.log(chalk.blueBright(result));
          process.exit();
        })
        .catch(err => {
          console.log(chalk.red(err));
          process.exit();
        })
    }
  });