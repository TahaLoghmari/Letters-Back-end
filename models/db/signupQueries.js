const pool = require("./pool");
const bcrypt = require("bcrypt");

async function signUp(body) {
  try {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(body.password, saltRounds);
    const { rows } = await pool.query(
      "INSERT INTO users (username, hashed_password, icon) VALUES ($1, $2, $3) RETURNING username",
      [
        body.username,
        Buffer.from(hashedPassword),
        body.icon || "default-icon.png",
      ]
    );
    return rows[0];
  } catch (error) {
    throw error;
  }
}

module.exports = { signUp };
