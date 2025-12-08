# Connectify Backend API

A robust backend API for Connectify - A Feature-Rich Real-Time Chat Application built with Node.js, Express.js, MongoDB, and Socket.io.

## 🚀 Features

### Authentication & User Management
- JWT-based authentication with bcrypt password hashing
- User registration and login
- Profile management and settings
- User status management (online, offline, away, busy)
- Real-time user presence tracking

### Real-Time Chat
- Socket.io for real-time messaging
- Typing indicators
- Message reactions and editing
- File upload support
- Message search functionality
- Channel management (public/private/direct)

### Database Models
- **User**: Authentication, profile, settings, status
- **Channel**: Chat channels with member management
- **Message**: Messages with reactions, attachments, editing
- **Reactions**: Emoji reactions on messages
- **Attachments**: File uploads with metadata

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs
- **Real-Time**: Socket.io
- **File Upload**: Multer + Cloudinary
- **Environment**: dotenv

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Connectify-Backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env
   ```
   
   Update the `.env` file with your configuration:
   ```env
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/connectify
   JWT_SECRET=your-super-secret-jwt-key
   JWT_EXPIRE=7d
   CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
   CLOUDINARY_API_KEY=your-cloudinary-api-key
   CLOUDINARY_API_SECRET=your-cloudinary-api-secret
   FRONTEND_URL=http://localhost:5178
   ```

4. **Start MongoDB**
   ```bash
   # Using MongoDB locally
   mongod
   
   # Or using MongoDB Atlas (cloud)
   # Update MONGODB_URI in .env
   ```

5. **Run the server**
   ```bash
   # Development
   npm run dev
   
   # Production
   npm start
   ```

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update user profile
- `POST /api/auth/logout` - Logout user

### Chat
- `GET /api/chat/channels` - Get user channels
- `POST /api/chat/channels` - Create new channel
- `GET /api/chat/channels/:channelId/messages` - Get channel messages
- `POST /api/chat/channels/:channelId/messages` - Send message
- `PUT /api/chat/messages/:messageId` - Edit message
- `DELETE /api/chat/messages/:messageId` - Delete message
- `POST /api/chat/messages/:messageId/reactions` - Add/remove reaction
- `GET /api/chat/search` - Search messages

### Health Check
- `GET /api/health` - Server health status

## 🔌 Socket.io Events

### Client to Server
- `join-channels` - Join all user channels
- `join-channel` - Join specific channel
- `leave-channel` - Leave specific channel
- `send-message` - Send message to channel
- `typing-start` - Start typing indicator
- `typing-stop` - Stop typing indicator
- `add-reaction` - Add/remove message reaction
- `edit-message` - Edit message
- `delete-message` - Delete message
- `update-status` - Update user status

### Server to Client
- `new-message` - New message received
- `message-updated` - Message was updated
- `message-deleted` - Message was deleted
- `user-typing` - User started typing
- `user-stopped-typing` - User stopped typing
- `user-online` - User came online
- `user-offline` - User went offline
- `user-status-changed` - User status changed
- `error` - Error occurred

## 🗄️ Database Schema

### User Model
```javascript
{
  username: String (unique, required)
  email: String (unique, required)
  password: String (hashed, required)
  avatar: String (optional)
  status: String (online|offline|away|busy)
  lastSeen: Date
  settings: {
    notifications: Object
    privacy: Object
    theme: String
    language: String
  }
}
```

### Channel Model
```javascript
{
  name: String (required)
  description: String
  type: String (public|private|direct)
  members: [ObjectId] (User references)
  createdBy: ObjectId (User reference)
  lastMessage: ObjectId (Message reference)
  isActive: Boolean
}
```

### Message Model
```javascript
{
  content: String
  sender: ObjectId (User reference)
  channel: ObjectId (Channel reference)
  type: String (text|image|file|system)
  replyTo: ObjectId (Message reference)
  reactions: [Reaction]
  attachments: [Attachment]
  edited: Boolean
  editedAt: Date
  isDeleted: Boolean
  deletedAt: Date
}
```

## 🔒 Security Features

- JWT token authentication
- Password hashing with bcrypt
- CORS configuration
- Input validation and sanitization
- Error handling without sensitive data exposure
- Rate limiting (can be added)
- Helmet.js for security headers (can be added)

## 🚀 Deployment

### Environment Variables
Make sure to set these environment variables in production:

```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/connectify
JWT_SECRET=your-super-secure-jwt-secret
JWT_EXPIRE=7d
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret
FRONTEND_URL=https://your-frontend-domain.com
```

### Production Checklist
- [ ] Set secure JWT secret
- [ ] Configure MongoDB Atlas or secure MongoDB instance
- [ ] Set up Cloudinary for file uploads
- [ ] Configure CORS for production frontend URL
- [ ] Set NODE_ENV=production
- [ ] Add rate limiting
- [ ] Add security headers
- [ ] Set up monitoring and logging

## 🧪 Testing

```bash
# Run tests (when implemented)
npm test

# Run with coverage
npm run test:coverage
```

## 📝 API Documentation

### Request/Response Format

All API responses follow this format:
```javascript
{
  success: Boolean,
  message: String,
  data: Object (optional),
  error: String (optional)
}
```

### Authentication
Include JWT token in Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

### Socket.io Authentication
Include JWT token in auth object:
```javascript
const socket = io('http://localhost:5000', {
  auth: {
    token: 'your-jwt-token'
  }
});
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Express.js team for the amazing framework
- MongoDB team for the database
- Socket.io team for real-time functionality
- All contributors and the open-source community

---

**Connectify Backend** - Powering seamless real-time communication! 🚀💬
