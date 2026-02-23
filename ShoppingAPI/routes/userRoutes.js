const express = require("express");
const userController = require("./../controllers/userController");
const router = express.Router();

//defines a POST route for '/register' that runs the registerUser function
router.post("/register", userController.registerUser);
//POST route for '/login' that runs the loginUser function
router.post("/login", userController.loginUser);

module.exports = router;