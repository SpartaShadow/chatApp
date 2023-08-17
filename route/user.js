const express = require("express");
const router = express.Router();
const userController = require("../controller/user");
const middle = require("../middleware/auth");
router.post("/signup", userController.signup);
router.post("/login/sendMsg", middle.authenticate, userController.sendMsg);
router.get("/login/getMsg", middle.authenticate, userController.getMsg);
router.post("/login", userController.login);
module.exports = router;
