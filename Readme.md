# DevTinder

A dating application for developers built with Node.js, Express, and MongoDB.

## Overview

DevTinder is a social networking application that allows developers to connect with each other. Users can create profiles, browse other developers, send connection requests, and manage their professional relationships.

## Features

- **User Authentication**: Secure signup/login with JWT tokens
- **Profile Management**: Create and update developer profiles
- **Connection System**: Send and manage connection requests (like/pass)
- **User Discovery**: Browse other developers in the platform
- **Secure API**: Protected routes with authentication middleware

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Password Security**: bcrypt for password hashing
- **Validation**: Custom validation with validator.js

## Installation

1. Clone the repository:
```bash
git clone https://github.com/umangjitsingh/devtinder.git
cd devtinder
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
   Create a `.env` file in the root directory with:
```env
JWT_SECRET=your_jwt_secret_key
MONGODB_URI=your_mongodb_connection_string
PORT=3000
```

4. Start the development server:
```bash
npm run dev
```

## API Documentation

### Authentication Routes

#### POST /signup
Create a new user account.

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "emailId": "john@example.com",
  "password": "StrongPass123",
  "age": 25,
  "gender": "male",
  "about": "Full-stack developer",
  "skills": ["JavaScript", "React", "Node.js"],
  "photoUrl": "https://example.com/photo.jpg"
}
```

**Response:**
```json
{
  "message": "user created",
  "success": true,
  "user": { ... }
}
```

#### POST /login
Authenticate user and receive JWT token.

**Request Body:**
```json
{
  "emailId": "john@example.com",
  "password": "StrongPass123"
}
```

**Response:**
```json
{
  "message": "John Doe, is logged in successfully..",
  "success": true,
  "user": { ... }
}
```

#### POST /logout
Logout user and clear authentication token.

**Headers:** Requires authentication cookie

**Response:**
```json
{
  "success": true,
  "message": "John Doe, you are Logged out."
}
```

### User Management Routes

#### GET /profile
Get current user's profile information.

**Headers:** Requires authentication cookie

**Response:**
```json
{
  "success": true,
  "user": { ... },
  "message": "Logged in user is John Doe"
}
```

#### PATCH /user
Update user profile information.

**Headers:** Requires authentication cookie

**Allowed Fields:** lastName, gender, password, about, skills, photoUrl

**Request Body:**
```json
{
  "about": "Updated bio",
  "skills": ["JavaScript", "Python", "Docker"]
}
```

#### GET /feed
Get all users in the system.

**Response:**
```json
{
  "message": "list of all users",
  "users": [...]
}
```

#### GET /user
Find user by firstName.

**Request Body:**
```json
{
  "firstName": "john"
}
```

#### DELETE /user/:id
Delete a user by ID.

**Parameters:**
- `id`: User ID to delete

### Connection Request Routes

#### POST /request/send/:status/:toUserId
Send a connection request to another user.

**Parameters:**
- `status`: "like" or "pass"
- `toUserId`: Target user's ID

**Headers:** Requires authentication cookie

**Response:**
```json
{
  "message": "userId has liked/passed userId"
}
```

## Database Models

### User Model
```javascript
{
  firstName: String (required, 3-60 chars),
  lastName: String,
  emailId: String (required, unique, valid email),
  password: String (required, min 8 chars, strong password),
  age: Number (min 18),
  gender: String (enum: 'male', 'female', 'others'),
  photoUrl: String (valid URL),
  about: String,
  skills: [String] (max 7 skills),
  timestamps: true
}
```

### Connection Request Model
```javascript
{
  fromUserId: ObjectId (ref: User),
  toUserId: ObjectId (ref: User),
  status: String (enum: 'pass', 'like', 'accepted', 'rejected'),
  timestamps: true
}
```

## Project Structure

```
src/
├── models/
│   ├── user.model.js              # User schema and model
│   └── connectionRequest.models.js # Connection request schema
├── routes/
│   ├── user.routes.js             # User-related API routes
│   └── connectionRequest.routes.js # Connection request routes
├── middlewares/
│   └── userAuth(readJWT).js       # JWT authentication middleware
├── services/
│   ├── auth(JWT).js               # JWT token generation
│   └── validateIncomingData.js    # Input validation services
└── app.js                         # Main application entry point
```

## Authentication Flow

1. User signs up with email and password
2. Password is hashed using bcrypt
3. User logs in with credentials
4. Server validates credentials and generates JWT token
5. Token is stored in HTTP-only cookie
6. Protected routes verify token using middleware
7. User data is attached to request object for authorized routes

## Validation Rules

### User Registration
- **firstName**: Required, 3-60 characters, lowercase
- **emailId**: Required, unique, valid email format
- **password**: Required, minimum 8 characters, must be strong (includes uppercase)
- **age**: Minimum 18 years
- **gender**: Must be 'male', 'female', or 'others'
- **skills**: Maximum 7 skills allowed
- **photoUrl**: Must be valid URL format

### Connection Requests
- Users cannot send requests to themselves
- Duplicate requests are prevented
- Valid statuses: 'pass', 'like', 'accepted', 'rejected'

## Security Features

- Password hashing with bcrypt (salt rounds: 10)
- JWT token authentication
- Input validation and sanitization
- Protected routes with authentication middleware
- HTTP-only cookies for token storage
- Strong password requirements

## Development

### Scripts
- `npm run dev`: Start development server with nodemon
- `npm test`: Run tests (not implemented yet)

### Dependencies
- **express**: Web framework
- **mongoose**: MongoDB ODM
- **bcrypt**: Password hashing
- **jsonwebtoken**: JWT implementation
- **validator**: Input validation
- **cookie-parser**: Cookie parsing middleware
- **cors**: Cross-origin resource sharing
- **dotenv**: Environment variable management

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test your changes
5. Submit a pull request

## License

ISC License

## Author

Umang Jit Singh
