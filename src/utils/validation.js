const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };
  
  const validatePassword = (password) => {
    return password.length >= 8;
  };
  
  const validateUserInput = (userData) => {
    const errors = [];
    
    if (!validateEmail(userData.email)) {
      errors.push('Invalid email format');
    }
    
    if (!validatePassword(userData.password)) {
      errors.push('Password must be at least 8 characters long');
    }
    
    if (!userData.name || userData.name.trim() === '') {
      errors.push('Name is required');
    }
    
    return errors;
  };
  
  module.exports = { validateUserInput };