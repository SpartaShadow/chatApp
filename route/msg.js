const express = require("express");
const router = express.Router();
const msgController = require("../controller/msg");
const middle = require("../middleware/auth");

//ROUTES
router.post("/sendMsg", middle.authenticate, msgController.sendMsg);
router.get("/getMsg", middle.authenticate, msgController.getMsg);
router.get("/latestMsg", middle.authenticate, msgController.latestMsg);
router.get("/copydelete", msgController.copydelete);
router.post(
  "/sendfile/:groupId",
  middle.authenticate,
  msgController.uploadFile
);

//EXPORTS
module.exports = router;
