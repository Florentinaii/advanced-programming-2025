// In-memory storage
const users = {};

class User {
  constructor(id, email, password, name, address) {
    this.id = id;
    this.email = email;
    this.password = password; // This will be hashed
    this.name = name;
    this.address = address;
    this.registrationDate = new Date();
    this.lastLogin = null;
  }

  static create(userData) {
    const id = require('crypto').randomBytes(16).toString('hex');
    const user = new User(
      id,
      userData.email,
      userData.password,
      userData.name,
      userData.address
    );
    users[id] = user;
    return user;
  }

  static findById(id) {
    return users[id];
  }

  static findByEmail(email) {
    return Object.values(users).find(user => user.email === email);
  }

  static update(id, updateData) {
    const user = users[id];
    if (!user) return null;
    
    Object.keys(updateData).forEach(key => {
      if (key !== 'id' && key !== 'password' && user[key] !== undefined) {
        user[key] = updateData[key];
      }
    });
    
    return user;
  }
}

module.exports = User;