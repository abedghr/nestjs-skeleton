# 🚀 Messaging App Demo Guide

## Prerequisites
- Backend server running on `http://localhost:8080`
- React app running on `http://localhost:3000`

## Test Users
- **superadmin** (Password: `Admin@1234`)
- **superadmin1** (Password: `Admin@1234`)

## Demo Flow

### Step 1: Start the React App
```bash
cd frontend-messaging-app
npm start
```

### Step 2: Test User 1 (superadmin)
1. Open browser to `http://localhost:3000`
2. Login with:
   - Username: `superadmin`
   - Password: `Admin@1234`
3. You should see the messaging interface
4. Click the user icon (👤) in the top right
5. You should see `superadmin1` in the user list
6. Click on `superadmin1` to start a conversation
7. Send a message: "Hello superadmin1!"

### Step 3: Test User 2 (superadmin1)
1. Open a new incognito/private browser window
2. Go to `http://localhost:3000`
3. Login with:
   - Username: `superadmin1`
   - Password: `Admin@1234`
4. You should see the messaging interface
5. Click the user icon (👤) in the top right
6. You should see `superadmin` in the user list
7. Click on `superadmin` to start a conversation
8. You should see the message from superadmin: "Hello superadmin1!"
9. Reply: "Hi superadmin! How are you?"

### Step 4: Real-time Messaging
1. Go back to the superadmin window
2. You should see the real-time message from superadmin1
3. Continue the conversation between both users
4. Test typing indicators and real-time updates

## Expected Behavior

### Login
- ✅ Both users can login successfully
- ✅ JWT tokens are stored properly
- ✅ WebSocket connection established

### User List
- ✅ Each user sees only the other user (not themselves)
- ✅ User list shows correct names and emails

### Conversations
- ✅ Clicking a user creates a new conversation
- ✅ Conversations appear in the sidebar
- ✅ Messages are sent and received in real-time

### WebSocket Features
- ✅ Real-time message delivery
- ✅ Typing indicators
- ✅ Online/offline status (mock data)

## Troubleshooting

### If login fails:
- Check backend is running on port 8080
- Verify user credentials are correct
- Check browser console for errors

### If messages don't appear:
- Check WebSocket connection in browser console
- Verify both users are logged in
- Check backend logs for errors

### If user list is empty:
- Check localStorage for user data
- Verify API calls are working
- Check browser network tab for 404 errors

## API Endpoints Used

### Public (No Auth Required)
- `POST /api/public/auth/login` - User login

### Protected (Auth Required)
- `GET /api/v1/messaging/conversations` - Get conversations
- `POST /api/v1/messaging/conversations` - Create conversation
- `GET /api/v1/messaging/conversations/:id/messages` - Get messages
- `POST /api/v1/messaging/conversations/:id/messages` - Send message

### WebSocket
- `ws://localhost:8080/messaging` - Real-time messaging

## Mock Data
- User list is mocked since no public user endpoint exists
- Online status is mocked for demo purposes
- Real messaging functionality works with actual backend

