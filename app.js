//MODULES
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const server = require("http").Server(app);
const io = require("socket.io")(server);
const fileupload = require("express-fileupload");
app.use(fileupload());

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

//SOCKET
io.on("connection", (socket) => {
  console.log("SOCKET CONNECTED");
  socket.on("join-room", (grpid, username, cb) => {
    socket.join(grpid);
    console.log(io.sockets.adapter.rooms);
    cb(`${username} joined`);
  });
  socket.on("send-message", (gid, usermsg) => {
    if (gid == "undefined") {
      socket.broadcast.emit("receive-message", usermsg);
    } else {
      socket.to(gid).emit("receive-message", usermsg);
    }
  });
});

//middlewares
app.use(
  cors({
    origin: "*", // " * " give access to all
    methods: ["GET", "POST"], // allow predefined methods only without it then allows all methods
  })
);
app.use(bodyParser.json());
app.use(express.static("public"));
app.use("/user", userRoutes);
app.use("/user", grpRoutes);
app.use("/verifiedUser", msgRoutes);
app.use((req, res, next) => {
  if (req.url === "/") {
    return res.sendFile(path.join(__dirname, "public", "new.html"));
  }
  res.sendFile(path.join(__dirname, `${req.url}`));
});

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
  .sync()
  .then(server.listen(3000, () => console.log("server connected")))
  .catch((err) => console.log(err));
