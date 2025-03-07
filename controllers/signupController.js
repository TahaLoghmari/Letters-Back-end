const query = require("../models/db/signupQueries");

exports.signUp = async (req, res) => {
  try {
    if (!req.body.username || !req.body.password) {
      return res
        .status(400)
        .json({ message: "Username and password are required" });
    }

    const result = await query.signUp(req.body);
    res.status(201).json({
      message: "User created successfully",
      user: {
        username: result.username,
      },
    });
  } catch (error) {
    console.error("Signup error:", error);

    if (error.code === "23505") {
      return res.status(409).json({ message: "Username already exists" });
    }

    res.status(500).json({ message: "Error creating user" });
  }
};
