# 🎨 Frontend Integration Guide

## 🚀 **Complete Frontend Integration for Chat**

### **Prerequisites**
```bash
npm install socket.io-client
# or
yarn add socket.io-client
```

---

## 🔌 **1. WebSocket Connection Setup**

### **Socket Service (React/Vue/Angular)**
```typescript
// services/socketService.ts
import { io, Socket } from 'socket.io-client';

class SocketService {
    private socket: Socket | null = null;
    private token: string | null = null;

    connect(token: string) {
        this.token = token;
        this.socket = io('http://localhost:3000/messaging', {
            auth: { token },
            autoConnect: true,
            reconnection: true,
            reconnectionDelay: 1000,
            reconnectionAttempts: 5,
            timeout: 20000,
        });

        this.setupEventListeners();
        return this.socket;
    }

    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
        }
    }

    private setupEventListeners() {
        if (!this.socket) return;

        this.socket.on('connect', () => {
            console.log('✅ Connected to messaging server');
        });

        this.socket.on('disconnect', (reason) => {
            console.log('❌ Disconnected:', reason);
        });

        this.socket.on('connect_error', (error) => {
            console.error('Connection error:', error);
        });
    }

    // Message events
    sendMessage(conversationId: string, content: string, messageType: string = 'TEXT') {
        this.socket?.emit('send_message', {
            conversationId,
            content,
            messageType
        });
    }

    // Typing events
    startTyping(conversationId: string) {
        this.socket?.emit('typing_start', { conversationId });
    }

    stopTyping(conversationId: string) {
        this.socket?.emit('typing_stop', { conversationId });
    }

    // Join conversation room
    joinConversation(conversationId: string) {
        this.socket?.emit('join_conversation', { conversationId });
    }

    // Event listeners
    onNewMessage(callback: (data: any) => void) {
        this.socket?.on('new_message', callback);
    }

    onMessageSent(callback: (data: any) => void) {
        this.socket?.on('message_sent', callback);
    }

    onUserTyping(callback: (data: any) => void) {
        this.socket?.on('user_typing', callback);
    }

    onUserStoppedTyping(callback: (data: any) => void) {
        this.socket?.on('user_stopped_typing', callback);
    }

    onUserStatusChanged(callback: (data: any) => void) {
        this.socket?.on('user_status_changed', callback);
    }

    onMessageRead(callback: (data: any) => void) {
        this.socket?.on('message_read', callback);
    }

    // Cleanup
    removeAllListeners() {
        this.socket?.removeAllListeners();
    }
}

export const socketService = new SocketService();
```

---

## 🌐 **2. REST API Service**

### **Messaging API Service**
```typescript
// services/messagingApi.ts
class MessagingAPI {
    private baseURL = 'http://localhost:3000/user/messaging';
    private token: string;

    constructor(token: string) {
        this.token = token;
    }

    private async request(endpoint: string, options: RequestInit = {}) {
        const response = await fetch(`${this.baseURL}${endpoint}`, {
            ...options,
            headers: {
                'Authorization': `Bearer ${this.token}`,
                'Content-Type': 'application/json',
                ...options.headers,
            },
        });

        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }

        return await response.json();
    }

    // Conversations
    async getConversations(page: number = 1, perPage: number = 20) {
        return this.request(`/conversations?page=${page}&perPage=${perPage}`);
    }

    async createConversation(otherUserId: string) {
        return this.request('/conversations', {
            method: 'POST',
            body: JSON.stringify({ otherUserId }),
        });
    }

    async getConversation(conversationId: string) {
        return this.request(`/conversations/${conversationId}`);
    }

    // Messages
    async getMessages(conversationId: string, page: number = 1, perPage: number = 50) {
        return this.request(`/conversations/${conversationId}/messages?page=${page}&perPage=${perPage}`);
    }

    async sendMessage(conversationId: string, content: string, messageType: string = 'TEXT') {
        return this.request(`/conversations/${conversationId}/messages`, {
            method: 'POST',
            body: JSON.stringify({ content, messageType }),
        });
    }

    async markMessageAsRead(messageId: string) {
        return this.request(`/messages/${messageId}/read`, {
            method: 'PUT',
        });
    }

    async markAllMessagesAsRead(conversationId: string) {
        return this.request(`/conversations/${conversationId}/read`, {
            method: 'PUT',
        });
    }

    // Online Status
    async getOnlineUsers() {
        return this.request('/online-users');
    }

    async checkBulkOnlineStatus(userIds: string[]) {
        return this.request('/check-online-status', {
            method: 'POST',
            body: JSON.stringify({ userIds }),
        });
    }

    async getConversationParticipantsStatus(conversationId: string) {
        return this.request(`/conversations/${conversationId}/participants-status`);
    }
}

export { MessagingAPI };
```

---

## ⚛️ **3. React Implementation Example**

### **Chat Component**
```tsx
// components/Chat.tsx
import React, { useState, useEffect, useRef } from 'react';
import { socketService } from '../services/socketService';
import { MessagingAPI } from '../services/messagingApi';

interface Message {
    _id: string;
    content: string;
    sender: {
        _id: string;
        firstName: string;
        username: string;
        avatar?: string;
    };
    createdAt: string;
    status: 'SENT' | 'DELIVERED' | 'READ';
}

interface ChatProps {
    conversationId: string;
    currentUserId: string;
    otherUser: {
        _id: string;
        firstName: string;
        username: string;
        avatar?: string;
    };
    token: string;
}

const Chat: React.FC<ChatProps> = ({ 
    conversationId, 
    currentUserId, 
    otherUser, 
    token 
}) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [otherUserTyping, setOtherUserTyping] = useState(false);
    const [isOnline, setIsOnline] = useState(false);
    const [loading, setLoading] = useState(true);
    
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const typingTimeoutRef = useRef<NodeJS.Timeout>();
    const messagingAPI = useRef(new MessagingAPI(token));

    // Auto-scroll to bottom
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    // Load initial messages
    useEffect(() => {
        const loadMessages = async () => {
            try {
                const response = await messagingAPI.current.getMessages(conversationId);
                setMessages(response.data.reverse()); // Reverse for chronological order
                setLoading(false);
                scrollToBottom();
            } catch (error) {
                console.error('Failed to load messages:', error);
                setLoading(false);
            }
        };

        loadMessages();
    }, [conversationId]);

    // Setup socket connection and listeners
    useEffect(() => {
        // Connect to socket
        socketService.connect(token);
        
        // Join conversation room
        socketService.joinConversation(conversationId);

        // Listen for new messages
        socketService.onNewMessage((data) => {
            setMessages(prev => [...prev, data.message]);
            scrollToBottom();
            
            // Mark as read if conversation is active
            if (document.hasFocus()) {
                messagingAPI.current.markMessageAsRead(data.message._id);
            }
        });

        // Listen for message sent confirmation
        socketService.onMessageSent((data) => {
            setMessages(prev => 
                prev.map(msg => 
                    msg._id === data.tempId 
                        ? { ...msg, _id: data.messageId, status: 'SENT' }
                        : msg
                )
            );
        });

        // Listen for typing indicators
        socketService.onUserTyping((data) => {
            if (data.userId === otherUser._id) {
                setOtherUserTyping(true);
            }
        });

        socketService.onUserStoppedTyping((data) => {
            if (data.userId === otherUser._id) {
                setOtherUserTyping(false);
            }
        });

        // Listen for online status changes
        socketService.onUserStatusChanged((data) => {
            if (data.userId === otherUser._id) {
                setIsOnline(data.status === 'ONLINE');
            }
        });

        // Listen for read receipts
        socketService.onMessageRead((data) => {
            setMessages(prev =>
                prev.map(msg =>
                    msg._id === data.messageId
                        ? { ...msg, status: 'READ' }
                        : msg
                )
            );
        });

        // Check initial online status
        messagingAPI.current.checkBulkOnlineStatus([otherUser._id])
            .then(response => {
                setIsOnline(response.status[otherUser._id] || false);
            });

        return () => {
            socketService.removeAllListeners();
        };
    }, [conversationId, otherUser._id, token]);

    // Handle typing
    const handleTyping = (text: string) => {
        setNewMessage(text);

        if (!isTyping && text.length > 0) {
            setIsTyping(true);
            socketService.startTyping(conversationId);
        }

        // Clear existing timeout
        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }

        // Set new timeout to stop typing
        typingTimeoutRef.current = setTimeout(() => {
            setIsTyping(false);
            socketService.stopTyping(conversationId);
        }, 1000);
    };

    // Send message
    const sendMessage = async () => {
        if (!newMessage.trim()) return;

        const tempId = `temp_${Date.now()}`;
        const tempMessage: Message = {
            _id: tempId,
            content: newMessage,
            sender: {
                _id: currentUserId,
                firstName: 'You',
                username: 'you',
            },
            createdAt: new Date().toISOString(),
            status: 'SENT',
        };

        // Add message optimistically
        setMessages(prev => [...prev, tempMessage]);
        setNewMessage('');
        scrollToBottom();

        // Stop typing
        if (isTyping) {
            setIsTyping(false);
            socketService.stopTyping(conversationId);
        }

        try {
            // Send via WebSocket for real-time delivery
            socketService.sendMessage(conversationId, newMessage);
            
            // Or send via REST API
            // await messagingAPI.current.sendMessage(conversationId, newMessage);
        } catch (error) {
            console.error('Failed to send message:', error);
            // Remove optimistic message on error
            setMessages(prev => prev.filter(msg => msg._id !== tempId));
        }
    };

    // Handle Enter key
    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    // Render message status
    const renderMessageStatus = (message: Message) => {
        if (message.sender._id !== currentUserId) return null;

        switch (message.status) {
            case 'SENT':
                return <span className="message-status">✓</span>;
            case 'DELIVERED':
                return <span className="message-status">✓✓</span>;
            case 'read':
                return <span className="message-status read">✓✓</span>;
            default:
                return null;
        }
    };

    if (loading) {
        return <div className="chat-loading">Loading chat...</div>;
    }

    return (
        <div className="chat-container">
            {/* Chat Header */}
            <div className="chat-header">
                <div className="user-info">
                    <img 
                        src={otherUser.avatar || '/default-avatar.png'} 
                        alt={otherUser.firstName}
                        className="user-avatar"
                    />
                    <div>
                        <h3>{otherUser.firstName}</h3>
                        <span className={`status ${isOnline ? 'online' : 'offline'}`}>
                            {isOnline ? 'Online' : 'Offline'}
                        </span>
                    </div>
                </div>
            </div>

            {/* Messages */}
            <div className="messages-container">
                {messages.map((message) => (
                    <div 
                        key={message._id}
                        className={`message ${message.sender._id === currentUserId ? 'sent' : 'received'}`}
                    >
                        <div className="message-content">
                            {message.content}
                            {renderMessageStatus(message)}
                        </div>
                        <div className="message-time">
                            {new Date(message.createdAt).toLocaleTimeString()}
                        </div>
                    </div>
                ))}
                
                {/* Typing indicator */}
                {otherUserTyping && (
                    <div className="typing-indicator">
                        <span>{otherUser.firstName} is typing...</span>
                    </div>
                )}
                
                <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="message-input-container">
                <div className="message-input">
                    <textarea
                        value={newMessage}
                        onChange={(e) => handleTyping(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Type a message..."
                        rows={1}
                    />
                    <button 
                        onClick={sendMessage}
                        disabled={!newMessage.trim()}
                        className="send-button"
                    >
                        Send
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Chat;
```

---

## 📱 **4. Conversation List Component**

```tsx
// components/ConversationList.tsx
import React, { useState, useEffect } from 'react';
import { MessagingAPI } from '../services/messagingApi';
import { socketService } from '../services/socketService';

interface Conversation {
    _id: string;
    participants: Array<{
        _id: string;
        firstName: string;
        username: string;
        avatar?: string;
    }>;
    lastMessage?: {
        content: string;
        createdAt: string;
        sender: {
            firstName: string;
        };
    };
    unreadCount: number;
    updatedAt: string;
}

interface ConversationListProps {
    currentUserId: string;
    token: string;
    onSelectConversation: (conversation: Conversation) => void;
}

const ConversationList: React.FC<ConversationListProps> = ({
    currentUserId,
    token,
    onSelectConversation
}) => {
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [onlineUsers, setOnlineUsers] = useState<Record<string, boolean>>({});
    const [loading, setLoading] = useState(true);
    
    const messagingAPI = new MessagingAPI(token);

    // Load conversations
    useEffect(() => {
        const loadConversations = async () => {
            try {
                const response = await messagingAPI.getConversations();
                setConversations(response.data);
                
                // Get online status for all participants
                const userIds = response.data.flatMap((conv: Conversation) => 
                    conv.participants.map(p => p._id)
                ).filter((id: string) => id !== currentUserId);
                
                if (userIds.length > 0) {
                    const statusResponse = await messagingAPI.checkBulkOnlineStatus(userIds);
                    setOnlineUsers(statusResponse.status);
                }
                
                setLoading(false);
            } catch (error) {
                console.error('Failed to load conversations:', error);
                setLoading(false);
            }
        };

        loadConversations();
    }, [currentUserId, token]);

    // Listen for real-time updates
    useEffect(() => {
        // Listen for new messages to update conversation list
        socketService.onNewMessage((data) => {
            setConversations(prev => 
                prev.map(conv => 
                    conv._id === data.message.conversationId
                        ? {
                            ...conv,
                            lastMessage: {
                                content: data.message.content,
                                createdAt: data.message.createdAt,
                                sender: data.message.sender
                            },
                            unreadCount: conv.unreadCount + 1,
                            updatedAt: data.message.createdAt
                        }
                        : conv
                ).sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
            );
        });

        // Listen for online status changes
        socketService.onUserStatusChanged((data) => {
            setOnlineUsers(prev => ({
                ...prev,
                [data.userId]: data.status === 'ONLINE'
            }));
        });

        return () => {
            socketService.removeAllListeners();
        };
    }, []);

    const getOtherParticipant = (conversation: Conversation) => {
        return conversation.participants.find(p => p._id !== currentUserId);
    };

    const formatLastMessageTime = (timestamp: string) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

        if (diffInHours < 24) {
            return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        } else {
            return date.toLocaleDateString();
        }
    };

    if (loading) {
        return <div className="conversation-list-loading">Loading conversations...</div>;
    }

    return (
        <div className="conversation-list">
            <h2>Messages</h2>
            
            {conversations.length === 0 ? (
                <div className="no-conversations">
                    No conversations yet. Start a new chat!
                </div>
            ) : (
                conversations.map((conversation) => {
                    const otherUser = getOtherParticipant(conversation);
                    if (!otherUser) return null;

                    const isOnline = onlineUsers[otherUser._id] || false;

                    return (
                        <div
                            key={conversation._id}
                            className="conversation-item"
                            onClick={() => onSelectConversation(conversation)}
                        >
                            <div className="conversation-avatar">
                                <img
                                    src={otherUser.avatar || '/default-avatar.png'}
                                    alt={otherUser.firstName}
                                />
                                {isOnline && <div className="online-indicator" />}
                            </div>
                            
                            <div className="conversation-content">
                                <div className="conversation-header">
                                    <h4>{otherUser.firstName}</h4>
                                    {conversation.lastMessage && (
                                        <span className="last-message-time">
                                            {formatLastMessageTime(conversation.lastMessage.createdAt)}
                                        </span>
                                    )}
                                </div>
                                
                                <div className="conversation-preview">
                                    {conversation.lastMessage ? (
                                        <span className="last-message">
                                            {conversation.lastMessage.sender.firstName === 'You' ? 'You: ' : ''}
                                            {conversation.lastMessage.content}
                                        </span>
                                    ) : (
                                        <span className="no-messages">No messages yet</span>
                                    )}
                                    
                                    {conversation.unreadCount > 0 && (
                                        <div className="unread-badge">
                                            {conversation.unreadCount}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })
            )}
        </div>
    );
};

export default ConversationList;
```

---

## 🎨 **5. CSS Styles**

```css
/* styles/chat.css */

/* Chat Container */
.chat-container {
    display: flex;
    flex-direction: column;
    height: 100vh;
    max-width: 800px;
    margin: 0 auto;
    border: 1px solid #e1e5e9;
    border-radius: 8px;
    overflow: hidden;
}

/* Chat Header */
.chat-header {
    padding: 16px;
    background: #f8f9fa;
    border-bottom: 1px solid #e1e5e9;
}

.user-info {
    display: flex;
    align-items: center;
    gap: 12px;
}

.user-avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    object-fit: cover;
}

.status.online {
    color: #28a745;
    font-weight: 500;
}

.status.offline {
    color: #6c757d;
}

/* Messages */
.messages-container {
    flex: 1;
    overflow-y: auto;
    padding: 16px;
    background: #ffffff;
}

.message {
    margin-bottom: 16px;
    display: flex;
    flex-direction: column;
}

.message.sent {
    align-items: flex-end;
}

.message.received {
    align-items: flex-start;
}

.message-content {
    max-width: 70%;
    padding: 12px 16px;
    border-radius: 18px;
    word-wrap: break-word;
    position: relative;
}

.message.sent .message-content {
    background: #007bff;
    color: white;
    border-bottom-right-radius: 4px;
}

.message.received .message-content {
    background: #e9ecef;
    color: #212529;
    border-bottom-left-radius: 4px;
}

.message-time {
    font-size: 12px;
    color: #6c757d;
    margin-top: 4px;
}

.message-status {
    font-size: 12px;
    margin-left: 8px;
}

.message-status.read {
    color: #007bff;
}

/* Typing Indicator */
.typing-indicator {
    padding: 8px 16px;
    font-style: italic;
    color: #6c757d;
    font-size: 14px;
}

/* Message Input */
.message-input-container {
    padding: 16px;
    border-top: 1px solid #e1e5e9;
    background: #f8f9fa;
}

.message-input {
    display: flex;
    gap: 12px;
    align-items: flex-end;
}

.message-input textarea {
    flex: 1;
    resize: none;
    border: 1px solid #ced4da;
    border-radius: 20px;
    padding: 12px 16px;
    font-family: inherit;
    font-size: 14px;
    outline: none;
    max-height: 100px;
}

.message-input textarea:focus {
    border-color: #007bff;
}

.send-button {
    background: #007bff;
    color: white;
    border: none;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
}

.send-button:disabled {
    background: #6c757d;
    cursor: not-allowed;
}

/* Conversation List */
.conversation-list {
    width: 300px;
    border-right: 1px solid #e1e5e9;
    background: #f8f9fa;
    overflow-y: auto;
}

.conversation-item {
    display: flex;
    padding: 16px;
    border-bottom: 1px solid #e1e5e9;
    cursor: pointer;
    transition: background-color 0.2s;
}

.conversation-item:hover {
    background: #e9ecef;
}

.conversation-avatar {
    position: relative;
    margin-right: 12px;
}

.conversation-avatar img {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    object-fit: cover;
}

.online-indicator {
    position: absolute;
    bottom: 2px;
    right: 2px;
    width: 12px;
    height: 12px;
    background: #28a745;
    border: 2px solid white;
    border-radius: 50%;
}

.conversation-content {
    flex: 1;
    min-width: 0;
}

.conversation-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 4px;
}

.conversation-header h4 {
    margin: 0;
    font-size: 16px;
    font-weight: 600;
}

.last-message-time {
    font-size: 12px;
    color: #6c757d;
}

.conversation-preview {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.last-message {
    font-size: 14px;
    color: #6c757d;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    flex: 1;
}

.unread-badge {
    background: #dc3545;
    color: white;
    border-radius: 10px;
    padding: 2px 6px;
    font-size: 12px;
    font-weight: 600;
    min-width: 18px;
    text-align: center;
    margin-left: 8px;
}

/* Loading States */
.chat-loading,
.conversation-list-loading {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 200px;
    color: #6c757d;
}

/* Responsive */
@media (max-width: 768px) {
    .chat-container {
        height: 100vh;
        border: none;
        border-radius: 0;
    }
    
    .conversation-list {
        width: 100%;
        border-right: none;
    }
    
    .message-content {
        max-width: 85%;
    }
}
```

---

## 🚀 **6. Usage Example**

```tsx
// App.tsx
import React, { useState, useEffect } from 'react';
import ConversationList from './components/ConversationList';
import Chat from './components/Chat';
import { socketService } from './services/socketService';

const App: React.FC = () => {
    const [currentUser, setCurrentUser] = useState(null);
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('auth_token'));

    useEffect(() => {
        // Get current user info
        const fetchCurrentUser = async () => {
            try {
                const response = await fetch('/auth/me', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                const user = await response.json();
                setCurrentUser(user);
            } catch (error) {
                console.error('Failed to get current user:', error);
                // Redirect to login
            }
        };

        if (token) {
            fetchCurrentUser();
        }
    }, [token]);

    useEffect(() => {
        return () => {
            socketService.disconnect();
        };
    }, []);

    if (!currentUser || !token) {
        return <div>Loading...</div>;
    }

    return (
        <div className="app">
            <div className="chat-layout">
                <ConversationList
                    currentUserId={currentUser._id}
                    token={token}
                    onSelectConversation={setSelectedConversation}
                />
                
                {selectedConversation ? (
                    <Chat
                        conversationId={selectedConversation._id}
                        currentUserId={currentUser._id}
                        otherUser={selectedConversation.participants.find(
                            p => p._id !== currentUser._id
                        )}
                        token={token}
                    />
                ) : (
                    <div className="no-chat-selected">
                        Select a conversation to start chatting
                    </div>
                )}
            </div>
        </div>
    );
};

export default App;
```

---

## 🎉 **Complete Integration Summary**

### **What You Get:**
✅ **Real-time messaging** with WebSocket  
✅ **Online status indicators** (green dots)  
✅ **Typing indicators** ("User is typing...")  
✅ **Read receipts** (checkmarks)  
✅ **Optimistic UI updates** (instant message display)  
✅ **Auto-reconnection** handling  
✅ **Responsive design** (mobile-friendly)  
✅ **Error handling** and loading states  

### **Key Features:**
- **Socket.io integration** for real-time events
- **REST API** for data fetching
- **TypeScript support** for type safety
- **React hooks** for state management
- **CSS styling** for beautiful UI
- **Mobile responsive** design

This gives you a **complete, production-ready** chat interface! 🚀

