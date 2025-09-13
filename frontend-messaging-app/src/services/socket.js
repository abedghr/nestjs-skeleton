import { io } from 'socket.io-client';
import toast from 'react-hot-toast';

class SocketService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
    this.messageHandlers = new Map();
    this.connectionHandlers = new Map();
    this.recentMessageIds = new Set();
  }

  // Initialize socket connection
  connect(token) {
    if (this.socket && this.isConnected) {
      return this.socket;
    }

    // Clean the token to prevent header size issues
    const cleanToken = token.replace('Bearer ', '').trim();
    
    // Extract user ID from token for reference
    try {
      const payload = JSON.parse(atob(cleanToken.split('.')[1]));      
      this.currentUserId = payload._id;
    } catch (error) {
      console.error('Error extracting user ID from token:', error);
    }

    this.socket = io('http://localhost:8080/messaging', {
      auth: { token: `Bearer ${cleanToken}` },
      transports: ['websocket', 'polling'],
      extraHeaders: {
        'Content-Type': 'application/json',
      },
    });

    this.setupEventListeners();
    return this.socket;
  }

  // Setup socket event listeners
  setupEventListeners() {
    this.socket.on('connect', () => {
      console.log('Connected to messaging server');
      this.isConnected = true;
      toast.success('Connected to messaging server');
      this.notifyConnectionHandlers('connect');
    });

    this.socket.on('disconnect', (reason) => {
      console.log('Disconnected from messaging server:', reason);
      this.isConnected = false;
      toast.error('Disconnected from messaging server');
      this.notifyConnectionHandlers('disconnect');
    });

    this.socket.on('connect_error', (error) => {
      console.error('Connection error:', error);
      toast.error('Failed to connect to messaging server');
      this.notifyConnectionHandlers('error');
    });

    // Message events (only new_message retained)
    this.socket.on('new_message', (data) => {
      console.log('New message received:', data);
      this.notifyMessageHandlers('new_message', data);
      // Don't show toast for own messages, and guard against duplicate emits (room + personal)
      const msg = data && data.message;
      if (msg && msg.senderId !== this.currentUserId) {
        if (!msg._id || this.recentMessageIds.has(msg._id)) return;
        this.recentMessageIds.add(msg._id);
        setTimeout(() => this.recentMessageIds.delete(msg._id), 10000);
        toast.success('New message received');
      }
    });
  }

  // Join a conversation room
  joinConversation(conversationId) {
    if (!this.socket || !this.isConnected) {
      console.error('Socket not connected');
      return;
    }

    this.socket.emit('join_conversation', { conversationId });
    console.log(`Joined conversation: ${conversationId}`);
  }

  // Leave a conversation room
  leaveConversation(conversationId) {
    if (!this.socket || !this.isConnected) {
      return;
    }

    this.socket.emit('leave_conversation', { conversationId });
    console.log(`Left conversation: ${conversationId}`);
  }

  // Send a message
  sendMessage(conversationId, content, messageType = 'TEXT', filesData = null) {
    if (!this.socket || !this.isConnected) {
      console.error('Socket not connected');
      return;
    }

    const messageData = {
      conversationId,
      content,
      messageType,
    };

    // Add files data if provided
    if (filesData && filesData.length > 0) {
      messageData.files = filesData;
    }

    console.log('Sending message via socket:', messageData);
    this.socket.emit('send_message', messageData);
  }

  // Subscribe to message events
  onMessage(event, handler) {
    if (!this.messageHandlers.has(event)) {
      this.messageHandlers.set(event, []);
    }
    this.messageHandlers.get(event).push(handler);
  }

  // Unsubscribe from message events
  offMessage(event, handler) {
    if (this.messageHandlers.has(event)) {
      const handlers = this.messageHandlers.get(event);
      const index = handlers.indexOf(handler);
      if (index > -1) {
        handlers.splice(index, 1);
      }
    }
  }

  // Subscribe to connection events
  onConnection(event, handler) {
    if (!this.connectionHandlers.has(event)) {
      this.connectionHandlers.set(event, []);
    }
    this.connectionHandlers.get(event).push(handler);
  }

  // Unsubscribe from connection events
  offConnection(event, handler) {
    if (this.connectionHandlers.has(event)) {
      const handlers = this.connectionHandlers.get(event);
      const index = handlers.indexOf(handler);
      if (index > -1) {
        handlers.splice(index, 1);
      }
    }
  }

  // Notify message handlers
  notifyMessageHandlers(event, data) {
    if (this.messageHandlers.has(event)) {
      this.messageHandlers.get(event).forEach(handler => {
        try {
          handler(data);
        } catch (error) {
          console.error(`Error in message handler for ${event}:`, error);
        }
      });
    }
  }

  // Notify connection handlers
  notifyConnectionHandlers(event) {
    if (this.connectionHandlers.has(event)) {
      this.connectionHandlers.get(event).forEach(handler => {
        try {
          handler();
        } catch (error) {
          console.error(`Error in connection handler for ${event}:`, error);
        }
      });
    }
  }

  // Disconnect socket
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }

  // Get connection status
  getConnectionStatus() {
    return this.isConnected;
  }
}

// Create singleton instance
const socketService = new SocketService();
export default socketService;
