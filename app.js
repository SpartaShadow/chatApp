const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const userRoutes = require("./route/user");
const sequelize = require("./util/database");
const User = require("./model/user");
const Msg = require("./model/msg");

const app = express();

app.use(
  cors({
    origin: "*", // " * " give access to all
    methods: ["GET", "POST"], // allow predefined methods only without it then allows all methods
  })
);
app.use(bodyParser.json());
app.use("/user", userRoutes);
User.hasMany(Msg, { constraints: true, onDelete: "Cascade" });
Msg.belongsTo(User);
sequelize
  .sync()

  .then(app.listen(3000, () => console.log("server connected")))
  .catch((err) => console.log(err));
