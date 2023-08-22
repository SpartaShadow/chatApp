const User = require("../model/user");
const Msg = require("../model/msg");
const Grp = require("../model/group");
const Usergroup = require("../model/usergroup");

exports.addGrp = async (req, res, next) => {
  try {
    const { grpName } = req.body;
    console.log(">>>>>>>>>>", grpName);
    if (grpName === undefined || grpName.length === 0) {
      return res
        .status(200)
        .json({ message: "SomeThing is Missing", success: false });
    }
    const group = await Grp.create({ grpName });
    console.log(req.user.id);
    console.log("???????????", group.id);

    const usergroup = await Usergroup.create({
      isAdmin: true,
      grpId: group.id,
      userId: req.user.id,
    });
    res
      .status(200)
      .json({ message: group, success: true, username: req.user.username });
  } catch (err) {
    console.log(">>>>>>>>>", err);
    res
      .status(500)
      .json({ message: "Something went Wrong", success: false, error: err });
  }
};

exports.getGrp = async (req, res, next) => {
  try {
    const groupList = await Grp.findAll();
    res.status(200).json({ message: groupList, success: true });
  } catch (err) {
    console.log(">>>>>>>>>", err);
    res
      .status(500)
      .json({ message: "Something went Wrong", success: false, error: err });
  }
};
