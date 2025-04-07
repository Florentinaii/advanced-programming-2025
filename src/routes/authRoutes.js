import express from 'express';
import User from '../models/userModel.js';
import { comparePassword } from '../utils/passwordUtils.js';
import { generateToken } from '../utils/jwtUtils.js';

const router = express.Router();

router.post('/login', async (req, res) => {
  try {
    console.log("Login attempt for:", req.body.email);
    
    const { email, password } = req.body;
    
    // Validate input
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await User.findByEmail(email);
    
    if (!user) {
      console.log("User not found for email:", email);
      return res.status(401).json({ 
        error: 'Invalid credentials',
        code: 'USER_NOT_FOUND'
      });
    }

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      console.log("Password mismatch for user:", email);
      return res.status(401).json({ 
        error: 'Invalid credentials',
        code: 'INVALID_PASSWORD'
      });
    }

    // Update last login
    user.lastLogin = new Date();
    
    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role || 'user'  // Add role if available
    });

    console.log("Login successful for:", email);
    res.json({ 
      token,
      userId: user.id,
      email: user.email,
      name: user.name
    });
    
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ 
      error: 'Internal server error',
      code: 'SERVER_ERROR'
    });
  }
});

export default router;