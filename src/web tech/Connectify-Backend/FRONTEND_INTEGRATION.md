# Frontend Integration Guide

This guide explains how to integrate your React frontend with the Connectify backend API.

## 🔗 API Base URL

```
http://localhost:5000/api
```

## 🔐 Authentication

### 1. Register User
```javascript
const registerUser = async (userData) => {
  const response = await fetch('http://localhost:5000/api/auth/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData)
  });
  return response.json();
};

// Usage
const userData = {
  username: 'john_doe',
  email: 'john@example.com',
  password: 'password123'
};
const result = await registerUser(userData);
```

### 2. Login User
```javascript
const loginUser = async (credentials) => {
  const response = await fetch('http://localhost:5000/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials)
  });
  return response.json();
};

// Usage
const credentials = {
  email: 'john@example.com',
  password: 'password123'
};
const result = await loginUser(credentials);
// Store token: localStorage.setItem('token', result.data.token);
```

### 3. Get Current User
```javascript
const getCurrentUser = async () => {
  const token = localStorage.getItem('token');
  const response = await fetch('http://localhost:5000/api/auth/me', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return response.json();
};
```

## 💬 Chat API Integration

### 1. Get Channels
```javascript
const getChannels = async () => {
  const token = localStorage.getItem('token');
  const response = await fetch('http://localhost:5000/api/chat/channels', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return response.json();
};
```

### 2. Create Channel
```javascript
const createChannel = async (channelData) => {
  const token = localStorage.getItem('token');
  const response = await fetch('http://localhost:5000/api/chat/channels', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(channelData)
  });
  return response.json();
};
```

### 3. Get Channel Messages
```javascript
const getChannelMessages = async (channelId, page = 1, limit = 50) => {
  const token = localStorage.getItem('token');
  const response = await fetch(
    `http://localhost:5000/api/chat/channels/${channelId}/messages?page=${page}&limit=${limit}`,
    {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }
  );
  return response.json();
};
```

### 4. Send Message
```javascript
const sendMessage = async (channelId, messageData) => {
  const token = localStorage.getItem('token');
  const response = await fetch(`http://localhost:5000/api/chat/channels/${channelId}/messages`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(messageData)
  });
  return response.json();
};
```

## 🔌 Socket.io Integration

### 1. Install Socket.io Client
```bash
npm install socket.io-client
```

### 2. Connect to Socket.io
```javascript
import io from 'socket.io-client';

const socket = io('http://localhost:5000', {
  auth: {
    token: localStorage.getItem('token')
  }
});

// Connection events
socket.on('connect', () => {
  console.log('Connected to server');
});

socket.on('disconnect', () => {
  console.log('Disconnected from server');
});

socket.on('error', (error) => {
  console.error('Socket error:', error);
});
```

### 3. Join Channels
```javascript
// Join all user channels
socket.emit('join-channels');

// Join specific channel
socket.emit('join-channel', channelId);

// Leave channel
socket.emit('leave-channel', channelId);
```

### 4. Send Messages
```javascript
// Send message
socket.emit('send-message', {
  channelId: 'channel_id',
  content: 'Hello world!',
  type: 'text'
});

// Listen for new messages
socket.on('new-message', (message) => {
  console.log('New message:', message);
  // Update your UI with the new message
});
```

### 5. Typing Indicators
```javascript
// Start typing
socket.emit('typing-start', { channelId: 'channel_id' });

// Stop typing
socket.emit('typing-stop', { channelId: 'channel_id' });

// Listen for typing indicators
socket.on('user-typing', (data) => {
  console.log(`${data.username} is typing...`);
});

socket.on('user-stopped-typing', (data) => {
  console.log(`${data.username} stopped typing`);
});
```

### 6. Message Reactions
```javascript
// Add reaction
socket.emit('add-reaction', {
  messageId: 'message_id',
  emoji: '👍'
});

// Listen for message updates
socket.on('message-updated', (message) => {
  console.log('Message updated:', message);
  // Update your UI with the updated message
});
```

### 7. User Status
```javascript
// Update user status
socket.emit('update-status', { status: 'online' });

// Listen for user status changes
socket.on('user-online', (data) => {
  console.log(`${data.user.username} is online`);
});

socket.on('user-offline', (data) => {
  console.log(`User ${data.userId} is offline`);
});

socket.on('user-status-changed', (data) => {
  console.log(`User ${data.userId} status changed to ${data.status}`);
});
```

## 🔄 Complete Integration Example

```javascript
// authService.js
class AuthService {
  static async login(email, password) {
    const response = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await response.json();
    if (data.success) {
      localStorage.setItem('token', data.data.token);
    }
    return data;
  }

  static async register(username, email, password) {
    const response = await fetch('http://localhost:5000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password })
    });
    return response.json();
  }

  static getToken() {
    return localStorage.getItem('token');
  }

  static logout() {
    localStorage.removeItem('token');
  }
}

// chatService.js
class ChatService {
  static async getChannels() {
    const token = AuthService.getToken();
    const response = await fetch('http://localhost:5000/api/chat/channels', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return response.json();
  }

  static async sendMessage(channelId, content) {
    const token = AuthService.getToken();
    const response = await fetch(`http://localhost:5000/api/chat/channels/${channelId}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ content })
    });
    return response.json();
  }
}

// socketService.js
import io from 'socket.io-client';

class SocketService {
  constructor() {
    this.socket = null;
  }

  connect() {
    this.socket = io('http://localhost:5000', {
      auth: { token: AuthService.getToken() }
    });

    this.socket.on('connect', () => {
      console.log('Connected to chat server');
      this.socket.emit('join-channels');
    });

    this.socket.on('new-message', (message) => {
      // Handle new message in your React component
      console.log('New message:', message);
    });
  }

  sendMessage(channelId, content) {
    this.socket.emit('send-message', { channelId, content });
  }

  joinChannel(channelId) {
    this.socket.emit('join-channel', channelId);
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }
}

export { AuthService, ChatService, SocketService };
```

## 🚀 Quick Start

1. **Start the backend server:**
   ```bash
   cd Connectify-Backend
   npm run dev
   ```

2. **Update your frontend API calls:**
   - Change API base URL to `http://localhost:5000/api`
   - Add JWT token to Authorization headers
   - Connect Socket.io to `http://localhost:5000`

3. **Test the integration:**
   - Register a new user
   - Login and get the token
   - Create channels and send messages
   - Test real-time features

## 🔧 Environment Variables

Make sure your backend `.env` file has:
```env
FRONTEND_URL=http://localhost:5178
```

This allows CORS for your React frontend.

## 📝 Notes

- All API responses follow the format: `{ success: boolean, message: string, data: object }`
- JWT tokens expire in 7 days by default
- Socket.io requires authentication token in the `auth` object
- All chat routes require authentication
- Error responses include helpful error messages

Your React frontend should now be able to communicate seamlessly with the Connectify backend! 🎉
