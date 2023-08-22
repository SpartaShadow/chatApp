const express = require("express");
const router = express.Router();
const msgController = require("../controller/msg");
const middle = require("../middleware/auth");

router.post("/sendMsg", middle.authenticate, msgController.sendMsg);
router.get("/getMsg", middle.authenticate, msgController.getMsg);
router.get("/latestMsg", middle.authenticate, msgController.latestMsg);

module.exports = router;
