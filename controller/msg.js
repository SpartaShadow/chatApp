const Msg = require("../model/msg");
const Op = require("sequelize");

//SEND MESSAGE
exports.sendMsg = async (req, res, next) => {
  try {
    const { message } = req.body;
    const { name } = req.user;
    if (message.length === 0 || message === "") {
      return res.status(500).json({ message: "SomeThing is Missing" });
    }
    if (req.body.gid == 0) {
      const result = await req.user.createMsg({ message, name });
      return res.status(200).json(result);
    }
    const result = await req.user.createMsg({
      message,
      name,
      grpId: +req.body.gid,
    });
    res.status(200).json(result);
  } catch (error) {
    console.log(error);
  }
};

//GET OLD/NEXT 10 USER'S MESSAGE
exports.getMsg = async (req, res, next) => {
  let id = +req.query.msgid;
  console.log(req.query);
  let { gid } = req.query.gid;
  if (gid == 0) {
    gid = null;
  }
  console.log(">>>>>>>>>>>>>>>>>>>>>>>>" + gid);
  if (req.query.what === "old") {
    id = +req.query.msgid - 10;
    if (id < 10) {
      id = 0;
    }
  }
  console.log(id + "74");
  try {
    const result = await Msg.findAll({
      where: { userId: req.user.userId, grpId: gid },
      offset: id, //+/NUMBER for integer type
      limit: 10,
      attributes: ["message", "name", "grpId"],
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
      where: {
        grpId: null,
      },
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

//COPY & DELETE 1 DAY OLD
exports.copydelete = async (req, res, next) => {
  try {
    const result = await Msg.findAll({
      where: {
        sendAt: { [Op.lt]: new Date() },
      },
    });
    console.log(result);
    if (result.length > 0) {
      result.forEach((ele) => {
        Archived.create({
          name: ele.name,
          message: ele.message,
          sendAt: ele.Send_At,
          userId: ele.userId,
          grpId: ele.grpId,
        });
      });
      await Msg.destroy({
        where: {
          sendAt: {
            [Op.lt]: new Date(),
          },
        },
      });
      return res.status(201).json(result);
    }
    res.status(404).json("FAILED RESULT");
  } catch (err) {
    console.log(err);
  }
};

//UPLOAD FILE
function uploadToS3(file) {
  let s3bucket = new AWS.S3({
    accessKeyId: process.env.AWS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_KEY,
  });
  var params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: file.name,
    Body: file.data,
    ContentType: file.mimetype,
    ACL: "public-read",
  };
  return new Promise((resolve, reject) => {
    s3bucket.upload(params, (err, s3response) => {
      if (err) {
        console.log("SOMETHING WENT WRONG", err);
        reject(err);
      } else {
        resolve(s3response.Location);
      }
    });
  });
}
exports.uploadFile = async (req, res, next) => {
  try {
    const groupId = req.params.groupId;

    console.log(">>>>>>>", req.files.file);
    const file = req.files.file;
    console.log(req.files);
    const fileURL = await uploadToS3(file);
    console.log(fileURL);
    if (req.params.groupId == 0) {
      const user = await req.user.createMsg({
        name: req.user.username,
        message: fileURL,
      });
      return res.status(200).json({ message: user, success: true });
    }
    const user = await req.user.createMsg({
      name: req.user.username,
      message: fileURL,
      grpId: groupId,
    });
    res.status(200).json({ message: user, success: true });
  } catch (err) {
    console.log(">>>>>>>>>>>>>>>", err);
    res
      .status(500)
      .json({ message: "Something went Wrong", error: err, success: false });
  }
};
