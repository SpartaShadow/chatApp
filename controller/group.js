//models
const User = require("../model/user");
const Grp = require("../model/group");
const Usergroup = require("../model/usergroup");

//add grp
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

//GET GROUP
exports.getGrp = async (req, res, next) => {
  try {
    console.log(req.user.id);
    const groupList = await User.findOne({
      where: { id: req.user.id },
      attributes: [],
      include: {
        model: Grp,
        attributes: ["id", "grpName"],
        through: {
          attributes: ["isAdmin"],
        },
      },
    });
    let bool = false;
    let obj = groupList.get({ plain: true });
    obj.grps.forEach((ele) => {
      bool = ele.usergroup.isAdmin;
      delete ele.usergroup;
      ele.isAdmin = bool;
    });

    res.status(200).json({ message: obj.grps, success: true });
  } catch (err) {
    console.log(">>>>>>>>>", err);
    res
      .status(500)
      .json({ message: "Something went Wrong", success: false, error: err });
  }
};

exports.makeAdmin = async (req, res, next) => {
  try {
    const make = +req.query.id;
    const gid = +req.query.gid;
    const result = await Usergroup.update(
      { isAdmin: true },
      {
        where: { userId: +make, grpId: +gid },
      }
    );
    if (result) {
      res.status(201).json({ message: "Made Admin", success: true });
    }
  } catch (err) {
    console.log(err);
  }
};

exports.removeAdmin = async (req, res, next) => {
  try {
    const gid = +req.query.gid;
    const make = +req.query.id;
    const result = await Usergroup.update(
      { isAdmin: false },
      {
        where: { UserId: +make, grpId: +gid },
      }
    );
    if (result) {
      res.status(201).json({ message: "Removed from Admin", success: true });
    }
  } catch (err) {
    console.log(err);
  }
};

exports.removeFromGroup = async (req, res, next) => {
  try {
    const make = +req.query.id;
    const gid = +req.query.gid;
    console.log(">>>>>>>>>>>>>>>>>>" + make);
    const result = await Usergroup.destroy({
      where: { UserId: +make, grpId: +gid },
    });
    if (result) {
      res.status(201).json({ message: "Removed from Group", success: true });
    }
  } catch (err) {
    console.log(err);
  }
};

exports.deleteGrp = async (req, res, next) => {
  try {
    const gid = +req.query.gid;
    console.log(">>>>>>>>>>>>>>>>>>" + gid);
    const result = await Grp.destroy({
      where: { id: +gid },
    });
    if (result) {
      res.status(201).json({ message: "Deleted Group", success: true });
    }
  } catch (err) {
    console.log(err);
  }
};

exports.addToGroup = async (req, res, next) => {
  try {
    const make = +req.query.id;
    const gid = +req.query.gid;
    console.log(">>>>>>>>>>>>>>>>>>" + gid);
    const result = await Usergroup.create({
      userId: make,
      isAdmin: false,
      grpId: gid,
    });

    if (result) {
      res.status(201).json({ message: "Added To Group", success: true });
    }
  } catch (err) {
    console.log(err);
  }
};
