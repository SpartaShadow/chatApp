const User = require("../model/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Msg = require("../model/msg");
const Usergroup = require("../model/usergroup");

//SIGNUP
exports.signup = async (req, res, next) => {
  const { name, email, number, password } = req.body;
  const exist = await User.findOne({ where: { email: email } });
  if (exist) {
    return res.status(403).json({ message: "User already exist!!" });
  }
  const saltRounds = 10;
  bcrypt.hash(password, saltRounds, (err, hash) => {
    User.create({
      name: name,
      email: email,
      number: number,
      password: hash,
    })
      .then((result) =>
        res.status(201).json({ message: "Successfuly signed up!!" })
      )
      .catch((err) => console.log(err));
  });
};

//function for creating token
function generateToken(id, name, number) {
  return jwt.sign({ userId: id, name: name, number: number }, "ayanali");
}

//LOGIN
exports.login = async (req, res, next) => {
  const { email, password } = req.body;
  await User.findAll({ where: { email: email } })
    .then((exist) => {
      if (exist[0] == undefined) {
        //or(exist.length<1) so, yaha pe exist=[], exist[0]=undefined dega console krne pe
        return res.status(404).json({ message: "User doesn't exist" });
      }
      bcrypt.compare(password, exist[0].password, (err, result) => {
        if (result) {
          return res.status(201).json({
            message: "Login success",
            name: exist[0].name,
            token: generateToken(exist[0].id, exist[0].name, exist[0].number),
          });
        }
        console.log(exist[0].name);
        return res
          .status(401)
          .json({ message: "User not authorized", name: exist[0].name });
      });
    })
    .catch((err) => console.log(err));
};

//GET USERS OF GROUP
exports.getMembers = async (req, res, next) => {
  try {
    const { gid } = req.query;
    console.log(gid);
    const users = await Usergroup.findAll({
      where: {
        grpId: +gid,
      },
      attributes: ["userId"],
      include: {
        model: User,
        attributes: ["name"],
      },
      raw: true,
      nest: true,
    });
    let naam = "";
    users.forEach((ele) => {
      naam = ele.user.name;
      delete ele.user;
      ele.name = naam;
    });
    let isAdmin = await Usergroup.findOne({
      where: {
        userId: +req.user.id,
        grpId: +gid,
        isAdmin: true,
      },
    });
    if (!isAdmin) {
      isAdmin = { isAdmin: false };
    }

    const chats = await Msg.findAll({
      where: { grpId: +gid },
      attributes: ["name", "message"],
    });

    return res.status(201).json({ users: users, admin: isAdmin, chats: chats });
  } catch (err) {
    console.log(err);
  }
};

//SEARCH ALL USERS
exports.getUsers = async (req, res, next) => {
  try {
    console.log(req.query.search);
    const { search } = req.query;
    const users = await User.findAll({
      attributes: ["name", "number", "id"],
      raw: true,
    });
    const arr = [];
    users.forEach((ele) => {
      if (ele.number == search || ele.name.toLowerCase().indexOf(search) == 0) {
        arr.push(ele);
      }
    });
    res.status(201).json(arr);
  } catch (err) {
    console.log(err);
  }
};

//GET ALL USERS
exports.showUserOnly = async (req, res, next) => {
  try {
    const users = await User.findAll({
      attributes: ["id", "name"],
    });
    const chats = await Msg.findAll({
      where: { grpId: null },
      attributes: ["name", "message"],
    });

    return res.status(201).json({ users: users, chats: chats });
  } catch (err) {
    console.log(err);
  }
};
