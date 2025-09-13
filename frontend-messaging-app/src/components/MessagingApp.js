import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import socketService from '../services/socket';
import { messagingAPI, userAPI } from '../services/api';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import { LogOut, Send, User, MessageCircle, Paperclip, Image, FileText, X, Video, Volume2 } from 'lucide-react';

// Safe date formatting function
const safeFormatDate = (dateString, formatString) => {
  try {
    if (!dateString) return 'Now';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Now';
    return format(date, formatString);
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Now';
  }
};

const MessagingApp = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [users, setUsers] = useState([]);
  const [showUserList, setShowUserList] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  
  const messagesEndRef = useRef(null);
  const selectedConversationRef = useRef(null);

  // Load conversations
  const loadConversations = async () => {
    try {
      const response = await messagingAPI.getConversations();
      let conversations = response.data.data || [];
      
      // Filter out empty conversation objects from backend
      conversations = conversations.filter(conv => conv && Object.keys(conv).length > 0);
      
      console.log('Loaded conversations:', conversations.length);
      setConversations(conversations);
      
      // Save to localStorage for persistence
      localStorage.setItem('conversations', JSON.stringify(conversations));
      
      // Auto-select first conversation if none selected
      if (conversations.length > 0) {
        console.log('Auto-selecting first conversation:', conversations[0]);
        const conversation = conversations[0];
        setSelectedConversation(conversation);
        selectedConversationRef.current = conversation;
        setIsLoading(true);
        
        // Join conversation room
        if (conversation._id) {
          console.log('Joining conversation room from API:', conversation._id);
          if (!conversation._id.startsWith('conv_')) {
            socketService.joinConversation(conversation._id);
          }
          
          // Load messages
          if (!conversation._id.startsWith('conv_')) {
            messagingAPI.getMessages(conversation._id)
              .then(response => {
                const messages = response.data.data || [];
                setMessages(messages);
                setIsLoading(false);
              })
              .catch(error => {
                console.error('Error loading messages:', error);
                setMessages([]);
                setIsLoading(false);
              });
          } else {
            setMessages([]);
            setIsLoading(false);
          }
        }
      }
    } catch (error) {
      console.error('Error loading conversations:', error);
      // Don't show error toast for empty conversations
      if (error.response?.status !== 404) {
        toast.error('Failed to load conversations');
      }
      
      // Load from localStorage as fallback
      const savedConversations = localStorage.getItem('conversations');
      if (savedConversations) {
        try {
          const parsed = JSON.parse(savedConversations);
          setConversations(parsed);
        } catch (e) {
          console.error('Error parsing saved conversations:', e);
          setConversations([]);
        }
      } else {
        setConversations([]);
      }
    }
  };

  // Load users for new conversation
  const loadUsers = async () => {
    try {
      const response = await userAPI.getUsers({ perPage: 100, page:1 });
      setUsers(response.data.data);
    } catch (error) {
      console.error('Error loading users:', error);
    }
  };

  // Removed online users logic

  // Handle new message
  const handleNewMessage = (data) => {
    console.log('handleNewMessage called with:', data);
    
    // Handle different message structures
    let message = data.message || data;
    if (!message) {
      console.error('No message data received:', data);
      return;
    }
    
  
    
    // Add to messages if it's from current conversation and not from current user
    const conversationIdMatches = selectedConversation && 
      (message.conversationId === selectedConversation._id || 
       message.conversationId === selectedConversation._id?.toString() ||
       message.conversationId?.toString() === selectedConversation._id?.toString());
    
    if (conversationIdMatches) {
      console.log('Processing message for current conversation:', message);
      setMessages(prev => {
        console.log('Previous messages:', prev);
        
        // Check if this is our own message (optimistic update)
        const isOwnMessage = message.senderId === user?._id;
        
        if (isOwnMessage) {
          // Replace optimistic message with real one
          const updatedMessages = prev.map(existingMsg => {
            // Find optimistic message with same content and recent timestamp
            if (existingMsg.content === message.content && 
                existingMsg.senderId === message.senderId &&
                existingMsg.status === 'SENDING' &&
                Math.abs(new Date(existingMsg.createdAt) - new Date(message.createdAt)) < 10000) {
              console.log('Replacing optimistic message with real one:', message);
              // Preserve files from optimistic message if server message doesn't have them
              const preservedFiles = message.files && message.files.length > 0 ? message.files : existingMsg.files;
              return { ...message, status: 'SENT', files: preservedFiles };
            }
            return existingMsg;
          });
          
          // If no optimistic message found, add as new message
          const optimisticMessageFound = updatedMessages.some(msg => 
            msg.content === message.content && 
            msg.senderId === message.senderId &&
            msg.status === 'SENT'
          );
          
          if (!optimisticMessageFound) {
            console.log('Adding own message (no optimistic message found):', message);
            return [...prev, { ...message, status: 'SENT' }];
          }
          
          return updatedMessages;
        } else {
          // Check if message already exists to prevent duplicates
          const messageExists = prev.some(existingMsg => 
            existingMsg._id === message._id || 
            (existingMsg.content === message.content && 
             existingMsg.senderId === message.senderId &&
             Math.abs(new Date(existingMsg.createdAt) - new Date(message.createdAt)) < 5000)
          );
          
          if (messageExists) {
            console.log('Message already exists, not adding duplicate:', message);
            return prev;
          }
          
          console.log('Adding new message from other user:', message);
          return [...prev, message];
        }
      });
    } else {
      console.log('Message not added because:', {
        noSelectedConversation: !selectedConversation,
        conversationIdMismatch: selectedConversation?._id !== message.conversationId,
        isOwnMessage: message.senderId === user?._id
      });

      // If this is our own message and we were on a temp conversation, replace temp with real
      const isOwnMessage = message.senderId === user?._id;
      const tempSelected = selectedConversationRef.current && (selectedConversationRef.current._id || '').startsWith('conv_');
      if (isOwnMessage && tempSelected) {
        const tempId = selectedConversationRef.current._id;
        setConversations(prev => {
          const withoutTemp = prev.filter(c => c._id !== tempId);
          const newParticipantsKey = JSON.stringify((selectedConversationRef.current.participants || []).map(p => (p?._id || p)).sort());
          const withoutDupParticipants = withoutTemp.filter(c => JSON.stringify((c.participants || []).map(p => (p?._id || p)).sort()) !== newParticipantsKey);
          const upgraded = [{
            ...selectedConversationRef.current,
            _id: message.conversationId,
            lastMessage: message
          }, ...withoutDupParticipants].filter((c, idx, self) => idx === self.findIndex(t => t._id === c._id));
          localStorage.setItem('conversations', JSON.stringify(upgraded));
          return upgraded;
        });
        // Point selection to the real conversation id without auto-loading messages here
        const upgradedSelection = { ...selectedConversationRef.current, _id: message.conversationId, lastMessage: message };
        setSelectedConversation(upgradedSelection);
        selectedConversationRef.current = upgradedSelection;
        return;
      }

      const exists = conversations.some(conv => 
        conv._id === message.conversationId || 
        conv._id?.toString() === message.conversationId?.toString()
      );

      if (!exists && message.conversationId && !isOwnMessage) {
        // Create a lightweight conversation locally without extra API calls
        const otherUserId = message.senderId === user?._id
          ? (selectedConversation?.participants?.find(p => p && p._id !== user?._id)?._id)
          : message.senderId;

        const otherUserInfo = users.find(u => u._id === otherUserId) || { _id: otherUserId };
        const currentUserInfo = { _id: user?._id, firstName: user?.firstName, username: user?.username };
        const lightweightConversation = {
          _id: message.conversationId,
          participants: [currentUserInfo, otherUserInfo],
          type: 'DIRECT',
          lastMessage: message,
          messageCount: 0,
          updatedAt: new Date(),
          createdAt: new Date()
        };

        setConversations(prev => {
          const updated = [lightweightConversation, ...prev]
            .filter((c, idx, self) => idx === self.findIndex(t => t._id === c._id));
          localStorage.setItem('conversations', JSON.stringify(updated));
          return updated;
        });
      } else {
        // Update lastMessage for existing conversation preview only (no auto-select)
        setConversations(prev => prev.map(conv => 
          conv._id === message.conversationId || conv._id?.toString() === message.conversationId?.toString()
            ? { ...conv, lastMessage: message }
            : conv
        ));
      }
    }
    
    // Update conversation list
    setConversations(prev => 
      prev.map(conv => 
        conv._id === message.conversationId 
          ? { ...conv, lastMessage: message }
          : conv
      )
    );
  };

  // Removed read receipt handler

  // Removed online/offline handlers

  // Removed typing handlers

  // Initialize socket connection
  useEffect(() => {
    if (user) {
      const token = localStorage.getItem('accessToken');
      socketService.connect(token);
      
      // Load conversations from localStorage first for immediate display
      const savedConversations = localStorage.getItem('conversations');
      if (savedConversations) {
        try {
          const parsed = JSON.parse(savedConversations);
          setConversations(parsed);
          console.log('Loaded conversations from localStorage:', parsed.length);
          
          // Auto-select first conversation if none selected
          if (parsed.length > 0) {
            console.log('Auto-selecting first conversation from localStorage:', parsed[0]);
            const conversation = parsed[0];
            setSelectedConversation(conversation);
            selectedConversationRef.current = conversation;
            setIsLoading(true);
            
            // Join conversation room
            if (conversation._id) {
              console.log('Joining conversation room from localStorage:', conversation._id);
              if (!conversation._id.startsWith('conv_')) {
                socketService.joinConversation(conversation._id);
              }
              
              // Load messages
              if (!conversation._id.startsWith('conv_')) {
                messagingAPI.getMessages(conversation._id)
                  .then(response => {
                    const messages = response.data.data || [];
                    setMessages(messages);
                    setIsLoading(false);
                  })
                  .catch(error => {
                    console.error('Error loading messages:', error);
                    setMessages([]);
                    setIsLoading(false);
                  });
              } else {
                setMessages([]);
                setIsLoading(false);
              }
            }
          }
        } catch (e) {
          console.error('Error parsing saved conversations:', e);
        }
      }
      
      // Setup socket event listeners
      socketService.onMessage('new_message', handleNewMessage);
      // Only subscribe to new_message
      
      // Check socket connection status
      console.log('Socket connection status:', socketService.getConnectionStatus());
      
      // Load initial data
      loadConversations();
      loadUsers();
      // Online users removed
      
      // Self online tracking removed
    }

    return () => {
      socketService.disconnect();
      // Typing timeout removed
    };
  }, [user]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

    // Auto-select conversation if none selected but conversations exist
  useEffect(() => {
    if (conversations.length > 0) {
      console.log('Auto-selecting conversation from conversations list:', conversations[0]);
      // Call selectConversation without await since it's in useEffect
      const conversation = conversations[0];
      setSelectedConversation(conversation);
      selectedConversationRef.current = conversation;
      setIsLoading(true);
      
      // Join conversation room
      if (conversation._id) {
        console.log('Joining conversation room:', conversation._id);
        if (!conversation._id.startsWith('conv_')) {
          socketService.joinConversation(conversation._id);
        }
        
        // Load messages
        if (!conversation._id.startsWith('conv_')) {
          messagingAPI.getMessages(conversation._id)
            .then(response => {
              const messages = response.data.data || [];
              setMessages(messages);
              setIsLoading(false);
            })
            .catch(error => {
              console.error('Error loading messages:', error);
              setMessages([]);
              setIsLoading(false);
            });
        } else {
          setMessages([]);
          setIsLoading(false);
        }
      }
    }
  }, [conversations]);

  // Ensure self online removed

  // Select conversation
  const selectConversation = async (conversation) => {
    console.log('Selecting conversation:', conversation);
    setSelectedConversation(conversation);
    selectedConversationRef.current = conversation;
    setIsLoading(true);
    
    try {
      // Leave previous conversation room
      if (selectedConversation) {
        socketService.leaveConversation(selectedConversation._id);
      }
      
      // Join new conversation room only for real conversations
      console.log('Joining conversation room:', conversation._id);
      if (!conversation._id?.startsWith('conv_')) {
        socketService.joinConversation(conversation._id);
      }
      
      // Load messages (skip if using mock conversation ID)
      let messages = [];
      if (conversation._id && !conversation._id.startsWith('conv_')) {
        console.log('Loading messages for conversation:', conversation._id);
        const response = await messagingAPI.getMessages(conversation._id);
        console.log('Messages response:', response.data);
        messages = response.data.data || [];
        setMessages(messages);
        
        console.log('Loaded messages:', messages.length);
        
        // Read receipts removed
      } else {
        console.log('Using mock conversation, no messages to load');
        setMessages([]);
      }
    } catch (error) {
      console.error('Error loading messages:', error);
      console.error('Error response:', error.response?.data);
      toast.error('Failed to load messages');
      setMessages([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Send message
  const sendMessage = async () => {
    if ((!newMessage.trim() && selectedFiles.length === 0) || !selectedConversation || !user) return;

    let messageData = {
      content: newMessage.trim() || 
               (selectedFiles.length === 1 ? `Shared ${selectedFiles[0].name}` : '') ||
               (selectedFiles.length > 1 ? `Shared ${selectedFiles.length} files` : ''),
      messageType: 'TEXT'
    };

    try {
      // Ensure real conversation exists when sending first message
      let targetConversationId = selectedConversation._id;
      // if the conversation is a temp conversation, create a real conversation
      if (!targetConversationId || targetConversationId.startsWith('conv_')) {

        const otherParticipant = selectedConversation.participants?.find(p => p && p._id !== user._id);
        
        if (!otherParticipant?._id) {
          toast.error('Cannot determine recipient');
          return;
        }

        const resp = await messagingAPI.createConversation({ otherUserId: otherParticipant._id });
        const created = resp.data.data;
        if (!created?._id) {
          toast.error('Failed to create conversation');
          return;
        }

        // Update lists and selection
        setConversations(prev => {
          const withoutTemp = prev.filter(c => c._id !== targetConversationId);
          const createdKey = JSON.stringify((created.participants || []).map(p => (p?._id || p)).sort());
          const withoutDupParticipants = withoutTemp.filter(c => JSON.stringify((c.participants || []).map(p => (p?._id || p)).sort()) !== createdKey);
          const uniqueUpdatedConversations = [created, ...withoutDupParticipants].filter((conversation, index, self) =>
            index === self.findIndex(t => t._id === conversation._id)
          );
          localStorage.setItem('conversations', JSON.stringify(uniqueUpdatedConversations));
          return uniqueUpdatedConversations;
        });
        setSelectedConversation(created);
        selectedConversationRef.current = created;
        socketService.joinConversation(created._id);
        targetConversationId = created._id;
      }

      let filesData = null;

      // Handle file upload if files are selected (after ensuring we have a real conversation)
      if (selectedFiles.length > 0) {
        setIsUploading(true);
        try {
          // Always use multi-file upload API
          const uploadResponse = await messagingAPI.uploadFiles(targetConversationId, selectedFiles);
          filesData = uploadResponse.data.data;
          
          // Determine message type based on file types
          const hasImages = selectedFiles.some(file => file.type.startsWith('image/'));
          const hasVideos = selectedFiles.some(file => file.type.startsWith('video/'));
          const hasOthers = selectedFiles.some(file => !file.type.startsWith('image/') && !file.type.startsWith('video/'));
          
          if (hasImages && !hasVideos && !hasOthers) {
            messageData.messageType = 'IMAGE';
          } else if (hasVideos && !hasImages && !hasOthers) {
            messageData.messageType = 'VIDEO';
          } else {
            messageData.messageType = 'FILE'; // Mixed types or other files
          }

          // Update message content for files
          if (!newMessage.trim()) {
            if (selectedFiles.length === 1) {
              messageData.content = selectedFiles[0].name;
            } else {
              messageData.content = `${selectedFiles.length} files`;
            }
          }
        } catch (error) {
          console.error('Error uploading files:', error);
          toast.error('Failed to upload files');
          setIsUploading(false);
          return;
        } finally {
          setIsUploading(false);
        }
      }

      // Create optimistic message
      const optimisticMessage = {
        _id: `temp_${Date.now()}`,
        conversationId: targetConversationId,
        senderId: user?._id,
        sender: { _id: user?._id, firstName: user?.firstName, username: user?.username },
        content: messageData.content,
        messageType: messageData.messageType,
        status: 'SENDING',
        readBy: [],
        files: filesData || [],
        createdAt: new Date(),
        updatedAt: new Date()
      };

      // Add optimistic message immediately
      setMessages(prev => [...prev, optimisticMessage]);
      
      // Clear input immediately for better UX
      setNewMessage('');
      setSelectedFiles([]);

      // Send via socket for real-time (socket will handle backend communication)
      socketService.sendMessage(targetConversationId, messageData.content, messageData.messageType, filesData);
      
      // Update optimistic message status to SENDING
      setMessages(prev => prev.map(msg => 
        msg._id === optimisticMessage._id ? { ...msg, status: 'SENDING' } : msg
      ));
      
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
      
      // Remove optimistic message on error
      setMessages(prev => prev.filter(msg => msg._id !== `temp_${Date.now()}`));
    }
  };

  // Handle file selection
  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    
    if (files.length === 0) return;

    // Check max files limit
    if (files.length > 10) {
      toast.error('Maximum 10 files allowed');
      return;
    }

    // Validate each file
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = [
      // Images
      'image/jpeg', 'image/png', 'image/gif', 'image/webp',
      // Documents
      'application/pdf', 'application/msword', 
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'text/plain',
      // Videos
      'video/mp4', 'video/quicktime', 'video/avi', 'video/webm', 
      'video/mov', 'video/wmv', 'video/flv', 'video/mkv',
      // Audio
      'audio/mpeg', 'audio/wav', 'audio/mp3', 'audio/aac', 'audio/ogg'
    ];

    for (const file of files) {
      if (file.size > maxSize) {
        toast.error(`File ${file.name} exceeds 10MB limit`);
        return;
      }

      if (!allowedTypes.includes(file.type)) {
        toast.error(`File type not supported for ${file.name}`);
        return;
      }
    }

    // Always set files array
    setSelectedFiles(files);

    // Reset input
    e.target.value = '';
  };

  // Remove selected files
  const removeSelectedFiles = () => {
    setSelectedFiles([]);
  };

  // Remove specific file from selected files
  const removeFileFromSelection = (index) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  // Get file type icon
  const getFileIcon = (file) => {
    if (file.type.startsWith('image/')) {
      // eslint-disable-next-line react/jsx-no-undef
      return <Image size={16} />;
    } else if (file.type.startsWith('video/')) {
      // eslint-disable-next-line react/jsx-no-undef
      return <Video size={16} />;
    } else if (file.type.startsWith('audio/')) {
      // eslint-disable-next-line react/jsx-no-undef
      return <Volume2 size={16} />;
    }
    // eslint-disable-next-line react/jsx-no-undef
    return <FileText size={16} />;
  };

  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Handle enter key
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Create new conversation
  const createConversation = async (otherUser) => {
    try {
      // 1) Try to find an existing real conversation with this user
      const currentUserId = user?._id;
      const otherUserId = otherUser?._id;
      if (!currentUserId || !otherUserId) {
        toast.error('Invalid user');
        return;
      }

      const findMatchingConversation = (conv) => {
        if (!conv || !Array.isArray(conv.participants)) return false;
        const ids = conv.participants.map(p => p && p._id).filter(Boolean);
        return ids.includes(currentUserId) && ids.includes(otherUserId);
      };

      const existingReal = conversations.find(conv => findMatchingConversation(conv) && !(conv._id || '').startsWith('conv_'));
      if (existingReal) {
        // Reuse the real conversation, and remove any lingering temp conversations
        setConversations(prev => {
          const cleaned = prev.filter(c => !(c._id || '').startsWith('conv_'));
          localStorage.setItem('conversations', JSON.stringify(cleaned));
          return cleaned;
        });
        selectConversation(existingReal);
        setShowUserList(false);
        return;
      }

      // 2) If a temp conversation already exists, reuse it instead of creating another
      const existingTemp = conversations.find(conv => findMatchingConversation(conv) && (conv._id || '').startsWith('conv_'));
      if (existingTemp) {
        // Reuse the existing temp and remove any other temps
        setConversations(prev => {
          const cleaned = prev.filter(c => !(c._id || '').startsWith('conv_') || c._id === existingTemp._id);
          localStorage.setItem('conversations', JSON.stringify(cleaned));
          return cleaned;
        });
        selectConversation(existingTemp);
        setShowUserList(false);
        return;
      }

      // 3) Otherwise create a single temp conversation; real one will be created on first send
      const tempConversation = {
        _id: `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        participants: [
          { _id: currentUserId, firstName: user.firstName, username: user.username },
          { _id: otherUserId, firstName: otherUser.firstName, username: otherUser.username }
        ],
        type: 'DIRECT',
        lastMessage: null,
        messageCount: 0,
        updatedAt: new Date(),
        createdAt: new Date()
      };

      setConversations(prev => {
        // Keep only real conversations; drop all previous temps
        const withoutTemps = prev.filter(c => !(c._id || '').startsWith('conv_'));
        const uniqueUpdatedConversations = [tempConversation, ...withoutTemps].filter((conversation, index, self) =>
          index === self.findIndex(t => t._id === conversation._id)
        );
        localStorage.setItem('conversations', JSON.stringify(uniqueUpdatedConversations));
        return uniqueUpdatedConversations;
      });

      selectConversation(tempConversation);
      setShowUserList(false);
    } catch (error) {
      console.error('Error preparing conversation:', error);
      toast.error('Failed to start conversation');
    }
  };

  // Handle logout
  const handleLogout = () => {
    socketService.disconnect();
    logout();
    navigate('/login');
  };

  // Get other participant name
  const getOtherParticipantName = (conversation) => {
    if (!conversation || !Array.isArray(conversation.participants)) {
      return 'Unknown User';
    }
    const otherId = conversation.participants.find(p => p && p._id !== user._id)?._id;
    if (!otherId) return 'Unknown User';

    // Prefer data from conversation, otherwise resolve from loaded users
    const convEntry = conversation.participants.find(p => p && p._id === otherId) || {};
    const usersEntry = users.find(u => u._id === otherId) || {};

    const firstName = convEntry.firstName || usersEntry.firstName || '';
    const lastName = convEntry.lastName || usersEntry.lastName || '';
    const username = convEntry.username || usersEntry.username;
    const display = `${firstName} ${lastName}`.trim();

    if (display) return display;
    if (username) return username;

    // Fallback to short id
    const shortId = typeof otherId === 'string' ? `${otherId.slice(0,6)}…` : 'User';
    return shortId;
  };

  // User online status removed

  return (
    <div className="app">
      <div className="container">
        <div className="messaging-container">
          {/* Conversations Sidebar */}
          <div className="conversations-sidebar">
            <div style={{ padding: '16px', borderBottom: '1px solid #eee' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3>Messages</h3>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    className="btn"
                    style={{ padding: '8px', background: 'none', border: '1px solid #ddd' }}
                    onClick={() => setShowUserList(!showUserList)}
                  >
                    <User size={16} />
                  </button>
                  <button
                    className="btn"
                    style={{ padding: '8px', background: 'none', border: '1px solid #ddd' }}
                    onClick={handleLogout}
                  >
                    <LogOut size={16} />
                  </button>
                </div>
              </div>
              <p style={{ fontSize: '14px', color: '#666', marginTop: '4px' }}>
                Welcome, {user?.firstName || user?.username}!
              </p>
            </div>

            {/* User List for New Conversations */}
            {showUserList && (
              <div style={{ padding: '16px', borderBottom: '1px solid #eee' }}>
                <h4>Start New Conversation</h4>
                {users
                  .filter(u => u._id !== user._id)
                  .map(userItem => (
                    <div
                      key={userItem._id}
                      className="conversation-item"
                      onClick={() => createConversation(userItem)}
                      style={{ cursor: 'pointer' }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {/* Status dot removed */}
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 'bold' }}>
                            {userItem.firstName} {userItem.lastName || ''}
                          </div>
                          <div style={{ fontSize: '12px', color: '#666' }}>
                            {userItem.mobileNumber} • {userItem.roleType}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            )}

            {/* Conversations List */}
            <div style={{ flex: 1, overflowY: 'auto' }}>
              {conversations.length > 0 ? (
                conversations.map(conversation => (
                  <div
                    key={conversation._id}
                    className={`conversation-item ${selectedConversation?._id === conversation._id ? 'active' : ''}`}
                    onClick={() => selectConversation(conversation)}
                  >
                    <div className="conversation-header">
                      <span className="conversation-name">
                        {getOtherParticipantName(conversation)}
                      </span>
                      {/* User status removed */}
                    </div>
                    {conversation.lastMessage && (
                      <div className="conversation-last-message">
                        {conversation.lastMessage.senderId === user._id ? 'You: ' : ''}
                        {conversation.lastMessage.content}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
                  <p>No conversations yet</p>
                  <p style={{ fontSize: '12px', marginTop: '8px' }}>
                    Click the user icon to start a new conversation
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Chat Area */}
          <div className="chat-area">
            {selectedConversation ? (
              <>
                {/* Chat Header */}
                <div className="chat-header">
                  <div>
                    <h3>{getOtherParticipantName(selectedConversation)}</h3>
                    {/* User status removed */}
                  </div>
                </div>

                {/* Messages */}
                <div className="chat-messages">
                  {isLoading ? (
                    <div style={{ textAlign: 'center', padding: '20px' }}>Loading messages...</div>
                  ) : (
                    <>
                      {messages.map(message => {
                        const currentUserId = user?._id || (JSON.parse(localStorage.getItem('user') || '{}')._id);
                        
                        const normalizeId = (val) => {
                          if (!val) return null;
                          if (typeof val === 'object') {
                            if (val._id) return String(val._id);
                            // If it's a Date or other object, stringify safely
                            try { return String(val); } catch { return null; }
                          }
                          return String(val);
                        };
                        const senderId = normalizeId(message.senderId || message.sender?._id);
                        const meId = normalizeId(currentUserId);
                        const isOwn = senderId && meId && senderId === meId;
                        
                        
                        // Debug logging (only for file messages)
                        if (message.content && (message.content.includes('files') || message.files?.length > 0)) {
                          console.log('File Message structure:', {
                            id: message._id,
                            content: message.content,
                            messageType: message.messageType,
                            hasFiles: !!message.files,
                            filesLength: message.files?.length || 0,
                            files: message.files
                          });
                        }
                        
                        return (
                        <div
                          key={message._id}
                          style={{
                            display: 'flex',
                            justifyContent: isOwn ? 'flex-end' : 'flex-start',
                            marginBottom: '12px'
                          }}
                        >
                          <div className={`message ${isOwn ? 'sent' : 'received'}`}>
                          {message.content && message.content.includes('files') && (!message.files || message.files.length === 0) && (
                            <div style={{ padding: '8px', backgroundColor: '#fff3cd', borderRadius: '4px', fontSize: '12px' }}>
                              Debug: Message claims to have files but files array is empty or missing
                            </div>
                          )}
                          
                          {/* Multiple files rendering */}
                          {message.files && message.files.length > 0 ? (
                            <div>
                              <div style={{ 
                                display: 'grid', 
                                gridTemplateColumns: message.files?.length === 1 ? '1fr' : 'repeat(auto-fit, minmax(150px, 1fr))',
                                gap: '8px',
                                maxWidth: '400px'
                              }}>
                                {message.files?.map((file, index) => (
                                  <div key={index}>
                                    {file.mimeType?.startsWith('image/') ? (
                                      <img 
                                        src={file.fileUrl} 
                                        alt={file.fileName || 'Image'} 
                                        style={{ 
                                          width: '100%',
                                          maxWidth: message.files.length === 1 ? '200px' : '150px',
                                          maxHeight: '200px', 
                                          borderRadius: '8px',
                                          cursor: 'pointer',
                                          objectFit: 'cover'
                                        }}
                                        onClick={() => window.open(file.fileUrl, '_blank')}
                                      />
                                    ) : file.mimeType?.startsWith('video/') ? (
                                      <video 
                                        controls
                                        style={{ 
                                          width: '100%',
                                          maxWidth: message.files.length === 1 ? '300px' : '150px',
                                          maxHeight: '200px', 
                                          borderRadius: '8px'
                                        }}
                                      >
                                        <source src={file.fileUrl} />
                                        Your browser does not support the video tag.
                                      </video>
                                    ) : (
                                      <div 
                                        style={{ 
                                          display: 'flex', 
                                          alignItems: 'center', 
                                          gap: '8px',
                                          padding: '8px',
                                          border: '1px solid #ddd',
                                          borderRadius: '8px',
                                          cursor: 'pointer',
                                          backgroundColor: '#f9f9f9'
                                        }}
                                        onClick={() => window.open(file.fileUrl, '_blank')}
                                      >
                                        <FileText size={16} />
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                          <div style={{ 
                                            fontSize: '12px', 
                                            fontWeight: 'bold',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap'
                                          }}>
                                            {file.fileName}
                                          </div>
                                          <div style={{ fontSize: '10px', color: '#666' }}>
                                            {formatFileSize(file.fileSize)}
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                              {message.content && (
                                <div style={{ marginTop: '8px' }}>{message.content}</div>
                              )}
                            </div>
                          ) : 
                          /* Single file message rendering */
                          message.messageType === 'IMAGE' && message.fileUrl ? (
                            <div>
                              <img 
                                src={message.fileUrl} 
                                alt={message.fileName || 'Image'} 
                                style={{ 
                                  maxWidth: '200px', 
                                  maxHeight: '200px', 
                                  borderRadius: '8px',
                                  cursor: 'pointer'
                                }}
                                onClick={() => window.open(message.fileUrl, '_blank')}
                              />
                              {message.content !== message.fileName && (
                                <div style={{ marginTop: '4px' }}>{message.content}</div>
                              )}
                            </div>
                          ) : message.messageType === 'VIDEO' && message.fileUrl ? (
                            <div>
                              <video 
                                controls
                                style={{ 
                                  maxWidth: '300px', 
                                  maxHeight: '200px', 
                                  borderRadius: '8px'
                                }}
                              >
                                <source src={message.fileUrl} type="video/mp4" />
                                <source src={message.fileUrl} type="video/quicktime" />
                                <source src={message.fileUrl} type="video/webm" />
                                Your browser does not support the video tag.
                              </video>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
                                <Video size={12} />
                                <span style={{ fontSize: '12px', color: '#666' }}>
                                  {message.fileName}
                                </span>
                                {message.fileSize && (
                                  <span style={{ fontSize: '12px', color: '#666' }}>
                                    • {formatFileSize(message.fileSize)}
                                  </span>
                                )}
                              </div>
                              {message.content !== message.fileName && (
                                <div style={{ marginTop: '4px' }}>{message.content}</div>
                              )}
                            </div>
                          ) : message.messageType === 'FILE' && message.fileUrl ? (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <FileText size={16} />
                              <div style={{ flex: 1 }}>
                                <div 
                                  style={{ 
                                    color: '#007bff', 
                                    textDecoration: 'underline',
                                    cursor: 'pointer'
                                  }}
                                  onClick={() => window.open(message.fileUrl, '_blank')}
                                >
                                  {message.fileName || 'File'}
                                </div>
                                {message.fileSize && (
                                  <div style={{ fontSize: '12px', color: '#666' }}>
                                    {formatFileSize(message.fileSize)}
                                  </div>
                                )}
                                {message.content !== message.fileName && (
                                  <div style={{ marginTop: '4px' }}>{message.content}</div>
                                )}
                              </div>
                            </div>
                          ) : (
                            <div>{message.content}</div>
                          )}
                          
                          <div className="message-time">
                            {safeFormatDate(message.createdAt, 'HH:mm')}
                            {/* Read receipt removed */}
                          </div>
                          </div>
                        </div>
                        );
                      })}
                      
                      {/* Typing indicator removed */}
                      
                      <div ref={messagesEndRef} />
                    </>
                  )}
                </div>

                {/* Chat Input */}
                <div className="chat-input">
                  {/* Files preview */}
                  {selectedFiles.length > 0 && (
                    <div style={{
                      padding: '8px',
                      backgroundColor: '#f5f5f5',
                      borderRadius: '8px',
                      margin: '8px 0'
                    }}>
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '8px'
                      }}>
                        <div style={{ fontWeight: 'bold', fontSize: '14px' }}>
                          {selectedFiles.length} {selectedFiles.length === 1 ? 'file' : 'files'} selected
                        </div>
                        <button
                          type="button"
                          onClick={removeSelectedFiles}
                          style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            color: '#666'
                          }}
                        >
                          <X size={16} />
                        </button>
                      </div>
                      <div style={{ maxHeight: '120px', overflowY: 'auto' }}>
                        {selectedFiles.map((file, index) => (
                          <div
                            key={index}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px',
                              padding: '4px 0'
                            }}
                          >
                            {getFileIcon(file)}
                            <div style={{ flex: 1 }}>
                              <div style={{ fontSize: '13px' }}>{file.name}</div>
                              <div style={{ fontSize: '11px', color: '#666' }}>
                                {formatFileSize(file.size)}
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeFileFromSelection(index)}
                              style={{
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                color: '#666',
                                padding: '2px'
                              }}
                            >
                              <X size={12} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <input
                      type="file"
                      id="file-input"
                      multiple
                      style={{ display: 'none' }}
                      onChange={handleFileSelect}
                      accept="image/*,video/*,audio/*,application/pdf,.doc,.docx,.xls,.xlsx,.txt,.mp4,.mov,.avi,.webm,.mkv,.flv,.wmv,.mp3,.wav,.aac,.ogg"
                    />
                    <label
                      htmlFor="file-input"
                      style={{
                        cursor: 'pointer',
                        padding: '8px',
                        borderRadius: '4px',
                        border: '1px solid #ddd',
                        backgroundColor: '#f8f9fa',
                        display: 'flex',
                        alignItems: 'center'
                      }}
                    >
                      <Paperclip size={16} />
                    </label>
                    
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => {
                        setNewMessage(e.target.value);
                        // typing removed
                      }}
                      onKeyPress={handleKeyPress}
                      placeholder="Type a message..."
                      disabled={isLoading || isUploading}
                      style={{ flex: 1 }}
                    />
                    
                    <button 
                      onClick={sendMessage} 
                      disabled={(!newMessage.trim() && selectedFiles.length === 0) || isLoading || isUploading}
                    >
                      {isUploading ? '...' : <Send size={16} />}
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                justifyContent: 'center', 
                height: '100%',
                color: '#666'
              }}>
                <MessageCircle size={48} />
                <h3 style={{ marginTop: '16px' }}>Select a conversation</h3>
                <p>Choose a conversation from the sidebar to start messaging</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessagingApp;
