import bcrypt from 'bcryptjs';

// Configurable security parameters
const SALT_ROUNDS = parseInt(process.env.BCRYPT_SALT_ROUNDS) || 12; // Ensure this is a number
const MAX_PASSWORD_LENGTH = 72; // bcrypt's maximum input length

export const hashPassword = async (plainPassword) => {
  if (!plainPassword) {
    throw new Error('Password is required');
  }
  
  if (plainPassword.length > MAX_PASSWORD_LENGTH) {
    throw new Error(`Password must be less than ${MAX_PASSWORD_LENGTH} characters`);
  }

  // Additional validation for SALT_ROUNDS
  if (isNaN(SALT_ROUNDS) || SALT_ROUNDS < 1) {
    throw new Error('Invalid salt rounds configuration');
  }

  return await bcrypt.hash(plainPassword, SALT_ROUNDS);
};
export const comparePassword = async (plainPassword, hashedPassword) => {
  if (!plainPassword || !hashedPassword) {
    return false;
  }

  try {
    return await bcrypt.compare(plainPassword, hashedPassword);
  } catch (error) {
    console.error('Password comparison error:', error);
    return false;
  }
};

// Optional password strength validator
export const validatePasswordStrength = (password) => {
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChars = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  return {
    isValid: password.length >= minLength && 
             hasUpperCase && 
             hasLowerCase && 
             hasNumbers && 
             hasSpecialChars,
    requirements: {
      minLength,
      hasUpperCase,
      hasLowerCase,
      hasNumbers,
      hasSpecialChars
    }
  };
};