const query = require("../models/db/letterQueries");

exports.getLetters = async (req, res) => {
  try {
    const rows = await query.getLetters();
    res.json(rows);
  } catch (error) {
    console.error("Error getting letters:", error);
    res.status(500).json({ message: "Failed to retrieve letters" });
  }
};

exports.addLetter = async (req, res) => {
  try {
    if (!req.body.title || !req.body.text) {
      return res.status(400).json({ message: "Title and text are required" });
    }
    const letterData = {
      ...req.body,
      userid: req.user.userid,
    };
    const rows = await query.addLetter(letterData);
    res.status(201).json(rows);
  } catch (error) {
    console.error("Error adding letter:", error);
    res.status(500).json({ message: "Failed to add letter" });
  }
};

exports.deleteLetter = async (req, res) => {
  try {
    const { rows } = await query.deleteLetter(req.params.messageid);
    if (!rows) {
      return res.status(404).json({ message: "Letter not found" });
    }
    res.json(rows);
  } catch (error) {
    console.error("Error deleting letter:", error);
    res.status(500).json({ message: "Failed to delete letter" });
  }
};

exports.editLetter = async (req, res) => {
  try {
    if (!req.body.title && !req.body.text) {
      return res.status(400).json({ message: "Nothing to update" });
    }

    const { rows } = await query.editLetter(req.params.messageid, req.body);
    if (!rows) {
      return res.status(404).json({ message: "Letter not found" });
    }
    res.json(rows);
  } catch (error) {
    console.error("Error updating letter:", error);
    res.status(500).json({ message: "Failed to update letter" });
  }
};
