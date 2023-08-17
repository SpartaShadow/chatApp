const User = require("../model/user");
const jwt = require("jsonwebtoken");

exports.authenticate = (req, res, next) => {
  try {
    const token = req.header("authorization"); //const token1=req.headers.authorization; both are correct
    const user = jwt.verify(token, "ayanali");
    User.findByPk(user.userId).then((result) => {
      req.user = result;
      next();
    });
  } catch (err) {
    console.log(err);
    return res.status(401).json({ message: "Authorization failed" });
  }
};
