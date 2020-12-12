const api = require("../api");
const program = require("commander");
const inquirer = require('inquirer');
const chalk = require('chalk');


program
  .command("task")
  .option("-a, --add <task>", 'Add task')
  .option("-r, --remove", "Remove task")
  .option("-l, --list", "List tasks")
  .description("Trello")
  .action(async(obj) => {
    if(obj.add){
      await api.createCard(obj.add);
      console.log("Task Added Successfully");
      process.exit();
    }
    if(obj.list){
      let tasks = await api.getCards(obj.add);
      tasks.map((task, index) => console.log(index+1+ '. '+chalk.cyanBright(task.name)));
      process.exit();
    }
    if(obj.remove){
      let cards = await api.getCards();
      
      inquirer
      .prompt([
        {
          type: 'list',
          name: 'task',
          message: 'Select a task to remove?',
          choices: cards.map((val) => val.name),
        },
      ])
      .then(async(answers) => {
        let id;
        cards.forEach((card) => {
          if(card.name == answers.task){
            id = card.id;
          }
        });
        var result = await api.removeCard(id);
        console.log(result);
        process.exit();
      }).catch(err => {
        console.log(err);
        process.exit();
      });
    }
  });