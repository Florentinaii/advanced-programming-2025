# User Profile Microservice

A microservice for user management and authentication in an e-commerce application.

## Features

- User registration and profile management
- JWT-based authentication
- RESTful API design

## API Endpoints

### Health Check
- `GET /health` - Service health check

### User Management
- `POST /users` - Create a new user
- `GET /users/:id` - Get user by ID (authenticated)
- `PUT /users/:id` - Update user details (authenticated)
- `GET /users/me` - Get current user profile (authenticated)

### Authentication
- `POST /auth/login` - Authenticate user and get JWT token

## Setup

1. Clone the repository
2. Install dependencies: `npm install`
3. Create `.env` file with required environment variables
4. Start the server: `npm start` (or `npm run dev` for development)

## Environment Variables

- `PORT` - Server port (default: 3000)
- `JWT_SECRET` - Secret key for JWT token generation

## Example Requests

See the project documentation for example requests and responses.
- `PORT` - Server port (default: 3000)
- `JWT_SECRET` - Secret key for JWT token generation

## Example Requests

See the project documentation for example requests and responses.

![image](https://github.com/user-attachments/assets/0bf71f77-2178-4aec-926c-713c865cc1e1)
![image](https://github.com/user-attachments/assets/b05baa29-9c8b-4d02-9347-b9f2f747b9c9)
![image](https://github.com/user-attachments/assets/396d9041-e69d-412f-a3c5-111053fe1bbd)


