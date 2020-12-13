const api = require("../api");
const program = require("commander");
const inquirer = require('inquirer');
const chalk = require('chalk');


program
  .command("task")
  .option("-a, --add <task>", 'Add task')
  .option("-r, --remove", "Remove task")
  .option("-l, --list", "List tasks")
  .description("Trello task management")
  .action(async(obj) => {
    if(obj.add){
      api.createCard(obj.add).then(result => {
        console.log("Task Added Successfully");
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
      api.getCards()
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
          console.log(result);
          process.exit();
        })
        .catch(err => {
          console.log(chalk.red(err));
          process.exit();
        })
    }
  });