const express = require("express");
const { routes } = require("./Routes/routes");
const mongoose = require("mongoose");
const chalk = require("chalk");
require("dotenv").config();

//Environmentals
const host = process.env.host;
const port = process.env.PORT;
const db_uri = process.env.MONGODB_URI;

const app = express();
app.use(express.json());
routes(app);

mongoose
  .connect(db_uri, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(port, host, () => {
      console.log(
        chalk.black.bgCyanBright(
          " Server is listening ",
          chalk.underline(`http://${host}:${port} `)
        )
      );
    });
  })
  .catch(err => {
    console.log(chalk.red(err));
  });
