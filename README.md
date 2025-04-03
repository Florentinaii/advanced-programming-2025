# User Profile Microservice

## AI-Assisted Development Approach

I chose Node.js with Express for this microservice because of its excellent performance for I/O-heavy applications, its rich ecosystem of libraries, and its ability to handle asynchronous operations efficiently. The JWT authentication system provides stateless security while maintaining scalability.

**AI Tools Used**: ChatGPT was instrumental in developing this project. The AI assisted with:
- Structuring the Express application architecture
- Implementing JWT authentication flows
- Designing the RESTful API endpoints
- Creating proper middleware for authorization
- Setting up password hashing with bcrypt
- Writing comprehensive input validation

## The AI Development Experience

### What Worked Well
1. **Architecture Guidance**:
   - The AI helped design a clean MVC structure with proper separation of concerns
   - Suggested optimal routing organization for the microservice
   - Provided best practices for error handling middleware

2. **Security Implementation**:
   - Guided proper JWT implementation with expiration
   - Recommended secure password hashing techniques
   - Advised on protection against common vulnerabilities

3. **Validation Patterns**:
   - Suggested comprehensive validation for user input
   - Provided email format verification
   - Recommended password strength requirements

### Challenges and Modifications
1. **Initial Configuration**:
   - AI suggestions for JWT setup needed adjustment for proper secret management
   - Required manual configuration of environment variables

2. **Database Abstraction**:
   - Original in-memory storage implementation was enhanced for future database compatibility
   - Added proper data sanitization beyond AI suggestions

3. **Error Handling**:
   - Expanded basic error handling to include more contextual information
   - Added proper status codes for different failure scenarios

## Key Features
- ✅ User registration with validation
- 🔐 JWT-based authentication
- 🛡️ Password hashing with bcrypt
- 📦 In-memory data storage (ready for DB integration)
- 📝 Comprehensive API documentation


![image](https://github.com/user-attachments/assets/0bf71f77-2178-4aec-926c-713c865cc1e1)
![image](https://github.com/user-attachments/assets/b05baa29-9c8b-4d02-9347-b9f2f747b9c9)
![image](https://github.com/user-attachments/assets/396d9041-e69d-412f-a3c5-111053fe1bbd)


