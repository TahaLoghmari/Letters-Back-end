const express = require("express");
const letterRouter = express.Router();
const letterController = require("../controllers/letterController");

const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: "Unauthorized" });
};

letterRouter.get("/letters", isAuthenticated, letterController.getLetters);
letterRouter.post("/letters", isAuthenticated, letterController.addLetter);
letterRouter.delete(
  "/letters/:messageid",
  isAuthenticated,
  letterController.deleteLetter
);
letterRouter.put(
  "/letters/:messageid",
  isAuthenticated,
  letterController.editLetter
);

module.exports = letterRouter;
