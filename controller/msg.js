const User = require("../model/user");
const Msg = require("../model/msg");

//SEND MESSAGE
exports.sendMsg = async (req, res, next) => {
  try {
    const { message } = req.body;
    const { name } = req.user;
    if (message.length === 0 || message === "") {
      return res.status(500).json({ message: "SomeThing is Missing" });
    }
    const result = await req.user.createMsg({ message, name });
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
      offset: id, //+/NUMBER for integer type
      limit: 10,
      attributes: ["id", "message", "name"],
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
    let count = await Msg.count();
    if (count < 10) {
      count = 10;
    }
    const result = await Msg.findAll({
      offset: Number(count - 10),
      limit: 10,
      attributes: ["id", "message", "name"],
    });
    if (result) {
      return res.status(200).json(result);
    }
    res.status(404).json({ success: "false" });
  } catch (err) {
    console.log(err);
  }
};
