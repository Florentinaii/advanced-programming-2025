const request = require('supertest');
const app = require('../app'); // Your Express app
const supabase = require('../config/db');

describe('User API', () => {
  let authToken;

  beforeAll(async () => {
    // Clear test data
    await supabase.from('users').delete().neq('email', '');
  });

  it('POST /users - should create a user', async () => {
    const res = await request(app)
      .post('/users')
      .send({
        email: 'api@example.com',
        password: 'password123',
        name: 'API Test'
      });
    
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('id');
  });

  it('POST /auth/login - should authenticate', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({
        email: 'api@example.com',
        password: 'password123'
      });
    
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('token');
    authToken = res.body.token;
  });

  it('GET /users/me - should get current user', async () => {
    const res = await request(app)
      .get('/users/me')
      .set('Authorization', `Bearer ${authToken}`);
    
    expect(res.statusCode).toEqual(200);
    expect(res.body.email).toBe('api@example.com');
  });
});