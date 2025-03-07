const pool = require("./pool");

const getUserByUsername = async (username) => {
  const query = "SELECT * FROM users WHERE username = $1";
  const { rows } = await pool.query(query, [username]);
  return rows[0];
};

module.exports = { getUserByUsername };
