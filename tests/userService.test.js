import { createUser, authenticateUser } from '../services/userService.js';
import supabase from '../config/db.js';
import { hashPassword } from '../utils/passwordUtils.js';

describe('User Service Unit Tests', () => {
  let testUserId;
  const testUser = {
    email: `testuser_${Date.now()}@example.com`,
    password: 'SecurePass123!',
    name: 'Test User'
  };

  beforeAll(async () => {
    // Clear test data and insert a test user
    await supabase.from('users').delete().neq('email', '');
    
    // Create a test user directly in DB for login tests
    const { data } = await supabase
      .from('users')
      .insert([{
        ...testUser,
        password: await hashPassword(testUser.password)
      }])
      .select()
      .single();
    
    testUserId = data.id;
  });

  afterAll(async () => {
    // Clean up test data
    await supabase.from('users').delete().eq('id', testUserId);
  });

  describe('createUser()', () => {
    it('should create a new user with valid data', async () => {
      const newUser = {
        email: `newuser_${Date.now()}@example.com`,
        password: 'ValidPass123!',
        name: 'New User',
        address: {
          street: '123 Test St',
          city: 'Testville'
        }
      };

      const user = await createUser(newUser);
      
      expect(user).toMatchObject({
        id: expect.any(String),
        email: newUser.email,
        name: newUser.name,
        address: newUser.address
      });
      expect(user).not.toHaveProperty('password');
      expect(user.registrationDate).toBeDefined();
    });

    it('should throw error for duplicate email', async () => {
      await expect(createUser({
        email: testUser.email,
        password: 'AnotherPass123!',
        name: 'Duplicate User'
      })).rejects.toThrow('Email already in use');
    });

    it('should throw error for missing required fields', async () => {
      await expect(createUser({
        email: 'invalid@example.com',
        // Missing password and name
      })).rejects.toThrow('Missing required fields');
    });
  });

  describe('authenticateUser()', () => {
    it('should authenticate with valid credentials', async () => {
      const auth = await authenticateUser(testUser.email, testUser.password);
      
      expect(auth).toEqual({
        token: expect.any(String),
        userId: testUserId
      });
    });

    it('should throw error for invalid password', async () => {
      await expect(authenticateUser(testUser.email, 'wrongpassword'))
        .rejects.toThrow('Invalid credentials');
    });

    it('should throw error for non-existent user', async () => {
      await expect(authenticateUser('nonexistent@example.com', 'anypassword'))
        .rejects.toThrow('Invalid credentials');
    });

    it('should update last_login on successful authentication', async () => {
      const beforeAuth = new Date();
      await authenticateUser(testUser.email, testUser.password);
      
      const { data: user } = await supabase
        .from('users')
        .select('last_login')
        .eq('id', testUserId)
        .single();
      
      expect(new Date(user.last_login)).toBeAfter(beforeAuth);
    });
  });
});