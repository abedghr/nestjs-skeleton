# React Messaging App

A real-time messaging application built with React, Socket.IO, and NestJS backend. This app demonstrates the complete messaging flow including authentication, real-time messaging, push notifications, and user status tracking.

## Features

✅ **Real-time Messaging** - Instant message delivery via WebSocket  
✅ **User Authentication** - JWT-based login/register system  
✅ **Push Notifications** - Firebase notifications for offline users  
✅ **Online/Offline Status** - Real-time user status tracking  
✅ **Read Receipts** - Message read status indicators  
✅ **Typing Indicators** - Shows when users are typing  
✅ **Conversation Management** - Create and manage conversations  
✅ **Message History** - Persistent message storage  
✅ **Modern UI** - Clean, responsive design  
✅ **Auto-scroll** - Messages automatically scroll to bottom  

## Project Structure

```
frontend-messaging-app/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Login.js              # Login form component
│   │   ├── Register.js           # Registration form component
│   │   └── MessagingApp.js       # Main messaging interface
│   ├── contexts/
│   │   └── AuthContext.js        # Authentication context
│   ├── services/
│   │   ├── api.js               # HTTP API service
│   │   └── socket.js            # WebSocket service
│   ├── App.js                   # Main app component with routing
│   ├── index.js                 # React entry point
│   └── index.css                # Global styles
├── package.json
└── README.md
```

## Installation & Setup

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- NestJS backend running on `http://localhost:3000`

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm start
   ```

3. **Open your browser:**
   Navigate to `http://localhost:3001`

## Usage Guide

### 1. Authentication Flow

**Registration:**
1. Navigate to `/register`
2. Fill in your details (First Name, Last Name, Email, Password)
3. Click "Create Account"
4. You'll be automatically logged in and redirected to messaging

**Login:**
1. Navigate to `/login`
2. Enter your email and password
3. Click "Login"
4. You'll be redirected to the messaging interface

### 2. Messaging Flow

**Starting a Conversation:**
1. Click the user icon (👤) in the top-right of the sidebar
2. Select a user from the list to start a conversation
3. The conversation will be created and opened automatically

**Sending Messages:**
1. Select a conversation from the sidebar
2. Type your message in the input field
3. Press Enter or click the send button
4. Messages are delivered in real-time

**Real-time Features:**
- **Online Status**: See who's online/offline
- **Typing Indicators**: See when someone is typing
- **Read Receipts**: See when your messages are read
- **Auto-scroll**: Messages automatically scroll to bottom

### 3. Offline/Online Scenario

**When User A sends message to offline User B:**
1. User A sends message (User B is offline)
2. User B receives push notification
3. User B opens app and logs in
4. User B sees the message in conversation
5. User B can reply and continue messaging

## API Integration

The app integrates with the NestJS backend through:

### HTTP API Endpoints
- `POST /api/v1/auth/login` - User authentication
- `POST /api/v1/auth/register` - User registration
- `GET /api/v1/messaging/conversations` - Get user conversations
- `POST /api/v1/messaging/conversations` - Create new conversation
- `GET /api/v1/messaging/conversations/:id/messages` - Get conversation messages
- `GET /api/v1/user/list` - Get all users

### WebSocket Events
- `connect` - Socket connection established
- `join_conversation` - Join conversation room
- `send_message` - Send message to conversation
- `new_message` - Receive new message
- `message_read` - Message read receipt
- `typing_start/typing_stop` - Typing indicators
- `user_online/user_offline` - User status updates

## Key Components

### MessagingApp.js
The main messaging interface that handles:
- Socket connection management
- Real-time message handling
- Conversation management
- User status tracking
- UI state management

### SocketService
Manages WebSocket connections and events:
- Connection establishment
- Event handling
- Message broadcasting
- Error handling

### AuthContext
Provides authentication state management:
- User login/logout
- Token management
- Protected routes
- Session persistence

## Styling

The app uses a modern, clean design with:
- Responsive layout
- Card-based components
- Status indicators (online/offline)
- Message bubbles
- Smooth animations
- Toast notifications

## Development

### Available Scripts

- `npm start` - Start development server
- `npm build` - Build for production
- `npm test` - Run tests
- `npm eject` - Eject from Create React App

### Environment Variables

Create a `.env` file in the root directory:

```env
REACT_APP_API_URL=http://localhost:3000/api/v1
```

## Testing the Complete Flow

### Scenario 1: Both Users Online
1. Open two browser windows/tabs
2. Login with different users in each
3. Start a conversation between them
4. Send messages back and forth
5. Observe real-time delivery and read receipts

### Scenario 2: One User Offline
1. Login with User A
2. Send message to User B (who is offline)
3. User B receives push notification
4. User B opens app and logs in
5. User B sees the message and can reply

### Scenario 3: Typing Indicators
1. Both users in same conversation
2. Start typing in one window
3. Other window shows "User is typing..."
4. Stop typing to see indicator disappear

## Troubleshooting

### Common Issues

1. **Socket Connection Failed**
   - Ensure NestJS backend is running
   - Check CORS settings in backend
   - Verify WebSocket gateway is enabled

2. **Authentication Errors**
   - Check JWT token in localStorage
   - Verify API endpoints are correct
   - Ensure backend auth routes are working

3. **Messages Not Sending**
   - Check socket connection status
   - Verify user is in conversation room
   - Check browser console for errors

### Debug Mode

Enable debug logging by adding to browser console:
```javascript
localStorage.setItem('debug', 'socket.io-client:*');
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

