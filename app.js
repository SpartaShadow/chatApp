//modules
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

//routes
const userRoutes = require("./route/user");
const msgRoutes = require("./route/msg");
const grpRoutes = require("./route/group");

//models
const sequelize = require("./util/database");
const User = require("./model/user");
const Msg = require("./model/msg");
const Grp = require("./model/group");
const Usergroup = require("./model/usergroup");

//middlewares
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

//user msg relationship
User.hasMany(Msg, { constraints: true, onDelete: "Cascade" });
Msg.belongsTo(User);

//super magic realtionship
User.belongsToMany(Grp, { through: Usergroup });
Grp.belongsToMany(User, { through: Usergroup });
User.hasMany(Usergroup, { constraints: true, onDelete: "Cascade" });
Usergroup.belongsTo(User);
Grp.hasMany(Usergroup, { constraints: true, onDelete: "Cascade" });
Usergroup.belongsTo(Grp);

//grp msg relationship
Grp.hasMany(Msg, { constraints: true, onDelete: "Cascade" });
Msg.belongsTo(Grp);

//sync
sequelize
  .sync({ force: true })

  .then(app.listen(3000, () => console.log("server connected")))
  .catch((err) => console.log(err));
