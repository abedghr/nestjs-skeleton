# Demo Flow: Complete Messaging System

This document provides step-by-step instructions to test the complete messaging flow between online and offline users.

## Prerequisites

1. **Backend Running**: Ensure your NestJS backend is running on `http://localhost:3000`
2. **Frontend Running**: Start the React app with `npm start` (runs on `http://localhost:3001`)
3. **Two Browser Windows**: You'll need two separate browser windows/tabs to simulate two users

## Demo Scenario: User A (Online) → User B (Offline) → Both Online

### Step 1: Setup User A (Online User)

1. **Open Browser Window 1**
2. **Navigate to**: `http://localhost:3001`
3. **Login as User A**:
   - Fill in details:
     - Username: `superadmin`
     - Password: `Admin@1234`
   - Click "Login"
4. **Verify Connection**:
   - You should see "Connected to messaging server" toast
   - Welcome message shows "Welcome, superadmin!" (or username)

### Step 2: Setup User B (Offline User)

1. **Open Browser Window 2** (incognito/private mode recommended)
2. **Navigate to**: `http://localhost:3001`
3. **Login as User B**:
   - Fill in details:
     - Username: `superadmin1`
     - Password: `Admin@1234`
   - Click "Login"
4. **Verify Connection**:
   - You should see "Connected to messaging server" toast
   - Welcome message shows "Welcome, superadmin1!" (or username)

### Step 3: User A Sends Message to User B (Both Online)

1. **In Window 1 (superadmin)**:
   - Click the user icon (👤) in the top-right
   - You should see "superadmin1" in the user list
   - Click on "superadmin1" to start conversation
   - Type: `"Hi superadmin1! How are you?"`
   - Press Enter or click Send

2. **In Window 2 (superadmin1)**:
   - You should immediately see the message appear
   - You should see a toast notification: "New message from superadmin"
   - The conversation should appear in the sidebar

3. **In Window 2 (superadmin1)**:
   - Click on the conversation with superadmin
   - Type: `"Hi superadmin! I'm doing great, thanks!"`
   - Press Enter or click Send

4. **In Window 1 (superadmin)**:
   - You should immediately see superadmin1's reply
   - You should see a toast notification

### Step 4: Test Offline Scenario

1. **Close Window 2 (Jane)** completely
2. **In Window 1 (John)**:
   - Type: `"Jane, are you still there?"`
   - Press Enter or click Send
   - The message should be sent (no immediate response)

3. **Open Window 2 (Jane) again**:
   - Navigate to `http://localhost:3001`
   - Login with `jane@example.com` and `password123`
   - You should see the message from John in the conversation
   - The message should be marked as unread initially

4. **In Window 2 (Jane)**:
   - Click on the conversation with John
   - The message should be marked as read automatically
   - Type: `"Sorry, I was away. Yes, I'm back now!"`
   - Press Enter or click Send

5. **In Window 1 (John)**:
   - You should immediately see Jane's reply
   - You should see read receipts for your previous messages

### Step 5: Test Real-time Features

1. **Typing Indicators**:
   - In Window 1 (John), start typing in the message input
   - In Window 2 (Jane), you should see "John is typing..."
   - Stop typing in Window 1
   - The typing indicator should disappear in Window 2

2. **Online Status**:
   - In Window 1, you should see Jane's status as "Online"
   - Close Window 2
   - In Window 1, Jane's status should change to "Offline"
   - Reopen Window 2 and login
   - Jane's status should change back to "Online"

3. **Read Receipts**:
   - Send a message from Window 1
   - In Window 2, click on the conversation
   - In Window 1, you should see "✓ Read" next to your message

## Expected Console Logs

### Window 1 (John) Console:
```
Connected to messaging server
Joined conversation: conv_123
Message sent in conversation conv_123
New message received: {message: {...}}
Message read: {messageId: "msg_456", readBy: "jane_id"}
```

### Window 2 (Jane) Console:
```
Connected to messaging server
Joined conversation: conv_123
New message received: {message: {...}}
Message sent in conversation conv_123
```

## Troubleshooting

### If Messages Don't Send:
1. Check browser console for errors
2. Verify both users are connected to WebSocket
3. Ensure users are in the same conversation room

### If Real-time Features Don't Work:
1. Check CORS settings in backend
2. Verify WebSocket gateway is enabled
3. Check network connectivity

### If Authentication Fails:
1. Clear browser localStorage
2. Check backend auth endpoints
3. Verify JWT token format

## API Calls to Monitor

### HTTP Requests:
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/register` - User registration
- `GET /api/v1/messaging/conversations` - Get conversations
- `POST /api/v1/messaging/conversations` - Create conversation
- `GET /api/v1/messaging/conversations/:id/messages` - Get messages

### WebSocket Events:
- `connect` - Socket connection
- `join_conversation` - Join room
- `send_message` - Send message
- `new_message` - Receive message
- `message_read` - Read receipt
- `typing_start/typing_stop` - Typing indicators

## Success Criteria

✅ **Both users can register and login**  
✅ **Users can create conversations**  
✅ **Messages are sent and received in real-time**  
✅ **Offline users receive messages when they come online**  
✅ **Typing indicators work**  
✅ **Online/offline status updates**  
✅ **Read receipts function properly**  
✅ **Push notifications work (if Firebase configured)**  

This demo demonstrates the complete messaging flow from authentication to real-time messaging with offline support.
