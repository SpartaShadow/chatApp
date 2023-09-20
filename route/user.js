const express = require("express");
const router = express.Router();
const userController = require("../controller/user");
const middleware = require("../middleware/auth");

//ROUTES
router.post("/signup", userController.signup);
router.post("/login", userController.login);
router.get("/login/getUsers", userController.getUsers);
router.get("/login/showUserOnly", userController.showUserOnly);
router.get(
  "/login/getMembers",
  middleware.authenticate,
  userController.getMembers
);

//EXPORTS
module.exports = router;
