const express = require("express");
const userRouter = express.Router();
const userController = require("../controllers/userController");

const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: "Unauthorized" });
};

userRouter.put(
  "/users/member/:userid",
  isAuthenticated,
  userController.makeMember
);
userRouter.put(
  "/users/admin/:userid",
  isAuthenticated,
  userController.makeAdmin
);
userRouter.put("/users/:userid", isAuthenticated, userController.editUser);

module.exports = userRouter;
