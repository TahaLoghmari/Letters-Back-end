const pool = require("./pool");
const bcrypt = require("bcrypt");

async function makeMember(userid) {
  let { rows } = await pool.query(
    "UPDATE users SET status = 'member' WHERE userid = $1 RETURNING username,status",
    [userid]
  );
  return rows[0];
}
async function makeAdmin(userid) {
  let { rows } = await pool.query(
    "UPDATE users SET status = 'admin' WHERE userid = $1 RETURNING username,status",
    [userid]
  );
  return rows[0];
}
async function editUser(userid, user) {
  try {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(user.password, saltRounds);
    let { rows } = await pool.query(
      "UPDATE users SET username = $1, status = $2, icon = $3, theme = $4, hashed_password = $5 WHERE userid = $6 RETURNING *",
      [
        user.username,
        user.status,
        user.icon,
        user.theme,
        Buffer.from(hashedPassword),
        userid,
      ]
    );
    return rows[0];
  } catch (error) {
    throw error;
  }
}
async function getUserById(userid) {
  const { rows } = await pool.query("SELECT * FROM users WHERE userid = $1", [
    userid,
  ]);
  return rows[0];
}
module.exports = {
  makeAdmin,
  makeMember,
  editUser,
  getUserById,
};
