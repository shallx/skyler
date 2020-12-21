const program = require("commander");
const my_path = require("../path");
const fse = require("fs-extra");
const fs = require("fs");
const handlebars = require("handlebars");

program
  .command("fetch <lang>")
  .option("-m, --model <name>", "Fetching model")
  .option("-c, --controller <name>", "Fetch Controller")
  .option("-r, --routes <name>", "Fetch Routes")
  .option("-mrc, --mrc_all <name>", "Fetch Model Route Controller")
  .description("Fetch template files")
  .action((lang, cmdObj) => {
    fetch_files(lang, cmdObj);
  });


function fetch_files(lang, cmdObj) {
  const n_lang = lang.toLowerCase();

  let _src, _des, data;
  switch (n_lang) {
    case "node":
      if (cmdObj.model) {
        data = {
          schema_name: cmdObj.model.toLowerCase(),
          model_name: capitalize(cmdObj.model),
        };
        _src = "/node/model.txt";
        _des = "Model/" + data.model_name + ".js";
      } else if (cmdObj.controller) {
        data = {
          controller_name: capitalize(cmdObj.controller),
          controller_obj: cmdObj.controller.toLowerCase(),
        };
        _src = "/node/controller.txt";
        _des = "Controller/" + data.controller_obj + "Controller" + ".js";
      } else if(cmdObj.routes) {
        data = {
          route_name: capitalize(cmdObj.routes),
          route_obj: cmdObj.routes.toLowerCase(),
        };
        _src = "/node/modelRoutes.txt";
        _des = "Routes/" + data.route_obj + "Routes" + ".js";
      }
      break;
    case "gitignore":
      data = {};
      _src = ".gitignore";
      _des = ".gitignore";
      break;
    case "errors":
      data = {};
      _src = "node/errors.txt";
      _des = "Controller/errors.js";
      break;
    default:
      console.log("$n_lang does not matches with any template");
  }
  const temp = fs.readFileSync(my_path.fetch_src(_src));
  const template = handlebars.compile(temp.toString());
  const templated_data = template(data);
  fse
    .outputFile(_des, templated_data)
    .then(() => {
      process.exit();
    })
    .catch(err => {
      console.log(err);
    });
}

function capitalize(s) {
  if (typeof s !== "string") return "";
  s=s.toLowerCase();
  return s.charAt(0).toUpperCase() + s.slice(1);
}