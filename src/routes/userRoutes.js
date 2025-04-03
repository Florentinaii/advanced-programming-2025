const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/authMiddleware');
const User = require('../models/userModel');
const { hashPassword } = require('../utils/passwordUtils');

// Create a new user
router.post('/', async (req, res) => {
  try {
    // Basic validation
    if (!req.body.email || !req.body.password || !req.body.name) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Check if user already exists
    if (User.findByEmail(req.body.email)) {
      return res.status(409).json({ error: 'Email already in use' });
    }

    // Hash password
    const hashedPassword = await hashPassword(req.body.password);
    
    // Create user
    const userData = { ...req.body, password: hashedPassword };
    const user = User.create(userData);

    // Return user data (excluding password)
    const { password, ...userWithoutPassword } = user;
    res.status(201).json(userWithoutPassword);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get user by ID
router.get('/:id', authenticate, (req, res) => {
  if (req.params.id !== req.userId) {
    return res.status(403).json({ error: 'Unauthorized' });
  }

  const user = User.findById(req.params.id);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  const { password, ...userWithoutPassword } = user;
  res.json(userWithoutPassword);
});

// Update user
router.put('/:id', authenticate, (req, res) => {
  if (req.params.id !== req.userId) {
    return res.status(403).json({ error: 'Unauthorized' });
  }

  const updatedUser = User.update(req.params.id, req.body);
  if (!updatedUser) {
    return res.status(404).json({ error: 'User not found' });
  }

  const { password, ...userWithoutPassword } = updatedUser;
  res.json(userWithoutPassword);
});

// Get current user profile
router.get('/me', authenticate, (req, res) => {
  const user = User.findById(req.userId);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  const { password, ...userWithoutPassword } = user;
  res.json(userWithoutPassword);
});

module.exports = router;