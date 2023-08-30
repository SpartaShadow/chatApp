const express = require("express");
const router = express.Router();
const grpController = require("../controller/group");
const middle = require("../middleware/auth");

router.post("/login/addGrp", middle.authenticate, grpController.addGrp);
router.get("/login/getGrp", middle.authenticate, grpController.getGrp);
router.get("/makeAdmin", grpController.makeAdmin);
router.get("/removeAdmin", grpController.removeAdmin);
router.get("/removeFromGroup", grpController.removeFromGroup);
router.get("/deleteGrp", grpController.deleteGrp);
router.get("/addToGroup", grpController.addToGroup);

module.exports = router;
