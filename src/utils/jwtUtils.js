import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

// Konfigurimi bazë i JWT
const JWT_CONFIG = {
  issuer: process.env.JWT_ISSUER || 'your_app_name',
  audience: process.env.JWT_AUDIENCE || 'client_app',
  expiresIn: process.env.JWT_EXPIRES_IN || '24h'
};

export const generateToken = (userId, additionalData = {}) => {
  if (!userId) throw new Error('userId is required for token generation');
  
  return jwt.sign(
    { 
      userId,
      ...additionalData 
    },
    process.env.JWT_SECRET,
    {
      ...JWT_CONFIG,
      algorithm: 'HS256' // Specifiko algoritmin
    }
  );
};

export const verifyToken = async (token) => {
  try {
    if (!token) throw new Error('No token provided');
    
    return await jwt.verify(token, process.env.JWT_SECRET, {
      ...JWT_CONFIG,
      algorithms: ['HS256']
    });
  } catch (error) {
    console.error('JWT Verification Error:', error.message);
    throw error; // Rikthe gabimin për trajtim në middleware
  }
};

export const decodeToken = (token) => {
  try {
    return jwt.decode(token);
  } catch (error) {
    console.error('Token decoding failed:', error);
    return null;
  }
};

export const refreshToken = async (token) => {
  const decoded = decodeToken(token);
  if (!decoded) return null;
  
  return generateToken(decoded.userId, {
    ...decoded,
    refresh: true // Shenjë për token refresh
  });
};