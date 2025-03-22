const query = require("../models/db/userQueries");

exports.makeMember = async (req, res) => {
  try {
    const rows = await query.makeMember(req.params.userid);
    if (!rows) return res.status(404).json({ message: "user not found" });
    res.status(201).json(rows);
  } catch (error) {
    res.status(500).json({ error: error });
  }
};
exports.makeAdmin = async (req, res) => {
  try {
    const rows = await query.makeAdmin(req.user.userid);
    if (!rows) return res.status(404).json({ message: "user not found" });
    res.status(201).json(rows);
  } catch (error) {
    res.status(500).json({ error: error });
  }
};
exports.editUser = async (req, res) => {
  try {
    const rows = await query.editUser(req.user.userid, req.body);
    if (!rows) return res.status(404).json({ message: "user not found" });
    res.status(201).json(rows);
  } catch (error) {
    res.status(500).json({ error: error });
  }
};
exports.available = async (req, res) => {
  if (req.isAuthenticated()) {
    res.json({ user: req.user });
  } else {
    res.status(401).json({ error: "Not authenticated" });
  }
};
exports.getUserById = async (req, res) => {
  try {
    const rows = await query.getUserById(req.params.userid);
    if (!rows) return res.status(404).json({ message: "user not found" });
    res.status(201).json(rows);
  } catch (error) {
    res.status(500).json({ error: error });
  }
};
