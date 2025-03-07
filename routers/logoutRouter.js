const express = require("express");
const logoutRouter = express.Router();
const logoutController = require("../controllers/logoutController");

logoutRouter.get("/log-out", logoutController.logout);

module.exports = logoutRouter;
