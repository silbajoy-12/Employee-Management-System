const express = require("express");
const bcrypt = require("bcryptjs");
const { Users } = require("../db");

const router = express.Router();

// POST /api/login
router.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: "Username and password are required." });
  }

  const user = Users.findByUsername(username);
  if (!user) {
    return res.status(401).json({ error: "Invalid username or password." });
  }

  const isMatch = bcrypt.compareSync(password, user.password);
  if (!isMatch) {
    return res.status(401).json({ error: "Invalid username or password." });
  }

  req.session.userId = user.id;
  req.session.username = user.username;
  res.json({ message: "Login successful", username: user.username });
});

// POST /api/logout
router.post("/logout", (req, res) => {
  req.session.destroy(() => {
    res.clearCookie("connect.sid");
    res.json({ message: "Logged out successfully" });
  });
});

// GET /api/session  -> check if currently logged in
router.get("/session", (req, res) => {
  if (req.session && req.session.userId) {
    return res.json({ loggedIn: true, username: req.session.username });
  }
  res.json({ loggedIn: false });
});

module.exports = router;
