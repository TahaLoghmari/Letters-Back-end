const express = require("express");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const { verifyUser } = require("../controllers/loginController");

const loginRouter = express.Router();

passport.use(
  new LocalStrategy(
    { usernameField: "username", passwordField: "password" },
    verifyUser
  )
);

passport.serializeUser((user, done) => {
  done(null, user.userid);
});

passport.deserializeUser(async (id, done) => {
  done(null, { userid: id });
});

loginRouter.post("/login", passport.authenticate("local"), (req, res) => {
  res.json({
    message: "Login successful",
    user: req.user,
  });
});

module.exports = loginRouter;
