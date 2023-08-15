const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const cors = require("cors");
const userRoutes = require("./route/user");
const sequelize = require("./util/database");

const app = express();

app.use(
  cors({
    origin: "http://127.0.0.1:5500", // " * " give access to all
    methods: ["GET", "POST"], // allow predefined methods only without it then allows all methods
  })
);
app.use(bodyParser.json());
app.use("/user", userRoutes);
sequelize
  .sync()
  .then(app.listen(4000, () => console.log("server connected")))
  .catch((err) => console.log(err));
