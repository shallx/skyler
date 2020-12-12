const express = require("express");
const Router = express.Router();
const bharatiaController = require("../controller/bharatiaController");

Router.post("/", bharatiaController.store);
Router.get("/", bharatiaController.index);
Router.get("/:_id", bharatiaController.show);
Router.put("/:_id", bharatiaController.update);
Router.delete("/:_id", bharatiaController.destroy);

module.exports = Router;