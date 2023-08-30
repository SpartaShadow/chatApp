const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const userRoutes = require("./route/user");
const msgRoutes = require("./route/msg");
const grpRoutes = require("./route/group");
const sequelize = require("./util/database");
const User = require("./model/user");
const Msg = require("./model/msg");
const Grp = require("./model/group");
const Usergroup = require("./model/usergroup");

const app = express();

app.use(
  cors({
    origin: "*", // " * " give access to all
    methods: ["GET", "POST"], // allow predefined methods only without it then allows all methods
  })
);
app.use(bodyParser.json());
app.use("/user", userRoutes);
app.use("/user", grpRoutes);
app.use("/verifiedUser", msgRoutes);

User.hasMany(Msg, { constraints: true, onDelete: "Cascade" });
Msg.belongsTo(User);

User.belongsToMany(Grp, { through: Usergroup });
Grp.belongsToMany(User, { through: Usergroup });
User.hasMany(Usergroup, { constraints: true, onDelete: "Cascade" });
Usergroup.belongsTo(User);
Grp.hasMany(Usergroup, { constraints: true, onDelete: "Cascade" });
Usergroup.belongsTo(Grp);

Grp.hasMany(Msg, { constraints: true, onDelete: "Cascade" });
Msg.belongsTo(Grp);

sequelize
  .sync({ force: true })

  .then(app.listen(3000, () => console.log("server connected")))
  .catch((err) => console.log(err));
