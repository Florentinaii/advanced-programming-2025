import jwt from 'jsonwebtoken';

const authenticate = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Authentication failed - no token provided' });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userData = { userId: decoded.userId };
    next();
  } catch (error) {
    return res.status(401).json({
      message: 'Authentication failed',
      error: error.message
    });
  }
};

export default authenticate;