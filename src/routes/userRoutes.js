import express from 'express';
import { authenticate } from '../middleware/authMiddleware.js';
import User from '../models/userModel.js';
import { hashPassword } from '../utils/passwordUtils.js';

const router = express.Router();

// Create a new user
router.post('/', async (req, res) => {
  try {
    // Enhanced validation
    const { email, password, name } = req.body;
    if (!email || !password || !name) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        details: {
          email: !email ? 'Email is required' : undefined,
          password: !password ? 'Password is required' : undefined,
          name: !name ? 'Name is required' : undefined
        }
      });
    }

    // Check if user exists (await if using async database)
    const existingUser = User.findByEmail(email);
    if (existingUser) {
      return res.status(409).json({ 
        error: 'Email already in use',
        code: 'EMAIL_EXISTS'
      });
    }

    // Hash password
    const hashedPassword = await hashPassword(password);
    
    // Create user
    const user = User.create({
      email,
      password: hashedPassword,
      name,
      address: req.body.address || null
    });

    // Return user data (excluding sensitive fields)
    const { password: _, ...userWithoutPassword } = user;
    res.status(201).json({
      ...userWithoutPassword,
      registrationDate: user.registrationDate.toISOString()
    });

  } catch (error) {
    console.error('User creation error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      code: 'SERVER_ERROR' 
    });
  }
});

// Get user by ID
router.get('/:id', authenticate, (req, res) => {
  if (req.params.id !== req.userId) {
    return res.status(403).json({ 
      error: 'Unauthorized access',
      code: 'ACCESS_DENIED'
    });
  }

  const user = User.findById(req.params.id);
  if (!user) {
    return res.status(404).json({ 
      error: 'User not found',
      code: 'USER_NOT_FOUND'
    });
  }

  const { password, ...userWithoutPassword } = user;
  res.json({
    ...userWithoutPassword,
    lastLogin: user.lastLogin?.toISOString() || null
  });
});

// Update user
router.put('/:id', authenticate, (req, res) => {
  if (req.params.id !== req.userId) {
    return res.status(403).json({ 
      error: 'Unauthorized access',
      code: 'ACCESS_DENIED'
    });
  }

  const updatedUser = User.update(req.params.id, req.body);
  if (!updatedUser) {
    return res.status(404).json({ 
      error: 'User not found',
      code: 'USER_NOT_FOUND'
    });
  }

  const { password, ...userWithoutPassword } = updatedUser;
  res.json(userWithoutPassword);
});

// Get current user profile
router.get('/me', authenticate, (req, res) => {
  const user = User.findById(req.userId);
  if (!user) {
    return res.status(404).json({ 
      error: 'User not found',
      code: 'USER_NOT_FOUND'
    });
  }

  const { password, ...userWithoutPassword } = user;
  res.json({
    ...userWithoutPassword,
    registrationDate: user.registrationDate.toISOString(),
    lastLogin: user.lastLogin?.toISOString() || null
  });
});

// userRoutes.js
router.put('/:id', 
  authenticate, 
  authorizeUpdate,
  async (req, res) => {
    try {
      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        { $set: req.body },
        { new: true }
      );
      res.json(updatedUser);
    } catch (error) {
      res.status(500).json({ error: 'Update failed' });
    }
  }
);
export default router;