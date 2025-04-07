export const validateEmail = (email) => {
  const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return re.test(String(email).toLowerCase());
};

export const validatePassword = (password) => {
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  
  return {
    isValid: password.length >= minLength && 
            hasUpperCase && 
            hasLowerCase && 
            hasNumber && 
            hasSpecialChar,
    requirements: {
      minLength,
      hasUpperCase,
      hasLowerCase,
      hasNumber,
      hasSpecialChar
    }
  };
};

export const validateName = (name) => {
  return name && name.trim().length >= 2 && /^[a-zA-Z\s\-']+$/.test(name);
};

export const validateUserInput = (userData) => {
  const errors = {};
  
  // Email validation
  if (!userData.email) {
    errors.email = 'Email is required';
  } else if (!validateEmail(userData.email)) {
    errors.email = 'Invalid email format';
  }
  
  // Password validation
  if (!userData.password) {
    errors.password = 'Password is required';
  } else {
    const passwordCheck = validatePassword(userData.password);
    if (!passwordCheck.isValid) {
      errors.password = {
        message: 'Password does not meet requirements',
        requirements: passwordCheck.requirements
      };
    }
  }
  
  // Name validation
  if (!userData.name) {
    errors.name = 'Name is required';
  } else if (!validateName(userData.name)) {
    errors.name = 'Name can only contain letters, spaces, hyphens, and apostrophes';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// Additional validation utilities
export const validateAddress = (address) => {
  // Implement address validation as needed
  return {
    isValid: true,
    errors: {}
  };
};