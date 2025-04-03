const express = require('express');
const router = express.Router();
const User = require('../models/userModel');
const { comparePassword } = require('../utils/passwordUtils');
const { generateToken } = require('../utils/jwtUtils');

router.post('/login', async (req, res) => {
  try {
    console.log("Login attempt for:", req.body.email);  // Properly placed log
    
    const { email, password } = req.body;
    const user = User.findByEmail(email);
    
    if (!user) {
      console.log("User not found");
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      console.log("Password mismatch");
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    user.lastLogin = new Date();
    const token = generateToken(user.id);
    
    console.log("Login successful for:", email);
    res.json({ token, userId: user.id });
    
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;