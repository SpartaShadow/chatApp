const User = require("../model/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Msg = require("../model/msg");

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
            token: generateToken(exist[0].id, exist[0].name, exist[0].number),
          });
        }
        return res.status(401).json({ message: "User not authorized" });
      });
    })
    .catch((err) => console.log(err));
};

//SEND MESSAGE
exports.sendMsg = async (req, res, next) => {
  const { message } = req.body;
  try {
    const result = await req.user.createMsg({ message });
    res.status(200).json(result);
  } catch (error) {
    console.log(err);
  }
};

//GET OLD/NEXT 10 USER'S MESSAGE
exports.getMsg = async (req, res, next) => {
  let id = +req.query.msgid;
  console.log(req.query);
  if (req.query.what === "old") {
    id = +req.query.msgid - 10;
    if (id < 10) {
      id = 0;
    }
  }
  console.log(id + "74");
  try {
    const result = await Msg.findAll({
      offset: id, //+/NUMEBR for integer type
      limit: 10,
      attributes: ["id", "message"],
      include: {
        model: User,
        attributes: ["name"],
      },
    });
    if (result) {
      return res.status(200).json(result);
    }
    res.status(404).json({ success: "false" });
  } catch (err) {
    console.log(err);
  }
};

//LATEST MESSAGE
exports.latestMsg = async (req, res, next) => {
  try {
    const count = await Msg.count();
    const result = await Msg.findAll({
      offset: Number(count - 10),
      limit: 10,
      attributes: ["id", "message"],
      include: {
        model: User,
        attributes: ["name"],
      },
    });
    if (result) {
      return res.status(200).json(result);
    }
    res.status(404).json({ success: "false" });
  } catch (err) {
    console.log(err);
  }
};
