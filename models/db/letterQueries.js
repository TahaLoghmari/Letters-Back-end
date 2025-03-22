const pool = require("./pool");

async function getLetters() {
  const { rows } = await pool.query("SELECT * FROM messages");
  return rows;
}
async function addLetter(letter) {
  const { rows } = await pool.query(
    "INSERT INTO messages(title,text,userid) VALUES($1,$2,$3) RETURNING title,text",
    [letter.title, letter.text, letter.userid]
  );
  return rows[0];
}
async function deleteLetter(messageid) {
  const { rows } = await pool.query(
    "DELETE FROM messages WHERE messageid = $1 RETURNING *",
    [messageid]
  );
  return rows.length > 0 ? rows[0] : null;
}
async function editLetter(messageid, letter) {
  const { rows } = await pool.query(
    "UPDATE messages SET title = $1 , text = $2 WHERE messageid = $3 RETURNING title , text",
    [letter.title, letter.text, messageid]
  );
  return rows[0];
}
module.exports = {
  getLetters,
  addLetter,
  deleteLetter,
  editLetter,
};
