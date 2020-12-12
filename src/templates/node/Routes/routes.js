// Route Imports
const bharatiaRoutes = require("./bharatiaRoutes");
const userRoutes = require("./userRoutes");
const holdingRoutes = require("./holdingRoutes");
const chalk = require("chalk");

exports.routes = app => {
  // Index Route
  app.get("/", (req, res, next) => {
    return res.json({
      message: "This is an api, what are you doing here?",
    });
  });
  app.use("/api", userRoutes);
  app.use("/api/bharatia", bharatiaRoutes);
  app.use("/api/holding", holdingRoutes);

  // If any error occurs
  app.use((err, req, res, next) => {
    console.log(chalk.red(err));
    const status = err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    const data = err.data;
    res.status(status).json({ message: message, data: data });
  });

  // If route does not exist
  app.use((req, res, next) => {
    res.json({ message: "Page not found" });
  });
};
