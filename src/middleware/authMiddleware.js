import { verifyToken } from '../utils/jwtUtils.js';

// authMiddleware.js
export const authorizeUpdate = (req, res, next) => {
  const { userId } = req.user; // Merr userId nga authenticate middleware
  const { id } = req.params; // ID nga URL

  if (userId !== id && !req.user.roles.includes('admin')) {
    return res.status(403).json({
      error: 'Unauthorized to update this user',
      code: 'UPDATE_FORBIDDEN'
    });
  }
  next();
};
export const authenticate = async (req, res, next) => {
  try {
    // Kontrollo nëse ekziston header-i Authorization
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        error: 'Authentication required',
        code: 'NO_TOKEN_PROVIDED',
        solution: 'Please provide a valid Bearer token in Authorization header'
      });
    }

    // Nxjerr token-in nga header-i
    const token = authHeader.split(' ')[1];
    
    // Verifiko token-in me options
    const decoded = await verifyToken(token);
    
    if (!decoded || !decoded.userId) {
      return res.status(401).json({
        error: 'Invalid or expired token',
        code: 'INVALID_TOKEN',
        details: 'Token failed verification or missing required claims'
      });
    }

    // Shto të dhënat e dekoduara në request
    req.user = {
      id: decoded.userId,
      roles: decoded.roles || [],
      ...decoded
    };

    next();
  } catch (error) {
    console.error('Authentication Error:', error.message);
    
    // Përgjigje më specifike bazuar në llojin e gabimit
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        error: 'Token expired',
        code: 'TOKEN_EXPIRED',
        solution: 'Please login again to get a new token'
      });
    }
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        error: 'Invalid token',
        code: 'INVALID_TOKEN',
        details: error.message
      });
    }

    return res.status(500).json({
      error: 'Authentication failed',
      code: 'AUTH_FAILURE',
      details: 'Internal server error during authentication'
    });
    
  }
  
};