const express = require("express");
const router = express.Router();
const grpController = require("../controller/group");
const middle = require("../middleware/auth");

router.post("/login/addGrp", middle.authenticate, grpController.addGrp);
router.get("/login/getGrp", middle.authenticate, grpController.getGrp);

module.exports = router;
