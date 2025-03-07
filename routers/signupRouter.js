const express = require("express");
const signupRouter = express.Router();
const signupController = require("../controllers/signupController");

signupRouter.post("/sign-up", signupController.signUp);

module.exports = signupRouter;
