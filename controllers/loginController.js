const bcrypt = require("bcrypt");
const { getUserByUsername } = require("../models/db/loginQueries");

const verifyUser = async (username, password, done) => {
  try {
    const user = await getUserByUsername(username);
    if (!user) {
      return done(null, false, { message: "Invalid credentials" });
    }
    const hashedPassword = user.hashed_password.toString("utf8");
    const match = await bcrypt.compare(password, hashedPassword);
    if (!match) {
      return done(null, false, { message: "Invalid credentials" });
    }
    const safeUser = {
      userid: user.userid,
      username: user.username,
      status: user.status,
      icon: user.icon,
      theme: user.theme,
    };
    return done(null, safeUser);
  } catch (error) {
    return done(error);
  }
};
module.exports = {
  verifyUser,
};
