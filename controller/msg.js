const Msg = require("../model/msg");

//SEND MESSAGE
exports.sendMsg = async (req, res, next) => {
  try {
    const { message } = req.body;
    const { name } = req.user;
    if (message.length === 0 || message === "") {
      return res.status(500).json({ message: "SomeThing is Missing" });
    }
    if (req.body.gid === "undefined") {
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
  const { gid } = req.query.gid;
  if (req.query.what === "old") {
    id = +req.query.msgid - 10;
    if (id < 10) {
      id = 0;
    }
  }
  console.log(id + "74");
  try {
    const result = await Msg.findAll({
      where: { userId: req.user.userId, grpId: gid || 0 },
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
    const fileName = file.name;
    const fileURL = await uploadToS3(file);
    console.log(fileURL);
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
