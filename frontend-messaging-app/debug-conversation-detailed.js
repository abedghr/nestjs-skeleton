const axios = require('axios');

function parseJwt(token) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error parsing JWT token:', error);
    return null;
  }
}

async function debugConversationDetailed() {
  try {
    console.log('🔍 Detailed conversation debugging...\n');
    
    // First login to get token
    const loginResponse = await axios.post('http://localhost:8080/api/public/auth/login', {
      username: 'superadmin',
      password: 'Admin@1234',
      source: 'DASHBOARD'
    });
    
    const token = loginResponse.data.data.tokens.accessToken;
    const jwtPayload = parseJwt(token);
    
    console.log('✅ Login successful');
    console.log('JWT payload user ID:', jwtPayload._id);
    console.log('JWT payload type:', jwtPayload.type);
    console.log('JWT payload email:', jwtPayload.email);
    
    // Test getting existing conversations first
    console.log('\n🔍 Testing get conversations...');
    try {
      const conversationsResponse = await axios.get('http://localhost:8080/api/messaging/conversations', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('✅ Get conversations successful');
      console.log('Conversations count:', conversationsResponse.data.data?.length || 0);
      console.log('Conversations:', JSON.stringify(conversationsResponse.data, null, 2));
    } catch (error) {
      console.log('❌ Get conversations failed:', error.response?.data || error.message);
    }
    
    // Create conversation
    console.log('\n🔍 Creating conversation...');
    console.log('Request payload:', {
      otherUserId: '1f085703-eb47-62d0-95e9-c440b3528e05'
    });
    
    const conversationResponse = await axios.post('http://localhost:8080/api/messaging/conversations', {
      otherUserId: '1f085703-eb47-62d0-95e9-c440b3528e05' // superadmin1
    }, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('\n📋 Conversation creation response:');
    console.log('Status:', conversationResponse.status);
    console.log('Data:', JSON.stringify(conversationResponse.data, null, 2));
    
    const conversation = conversationResponse.data.data;
    
    if (!conversation || Object.keys(conversation).length === 0) {
      console.log('\n❌ Conversation creation returned empty data!');
      console.log('This suggests the backend conversation service is failing.');
      return;
    }
    
    console.log('\n🔍 Conversation structure:');
    console.log('_id:', conversation._id);
    console.log('participants:', conversation.participants);
    console.log('type:', conversation.type);
    console.log('lastMessage:', conversation.lastMessage);
    
    // Try to get messages for this conversation
    if (conversation._id) {
      console.log('\n🔍 Testing message retrieval...');
      try {
        const messagesResponse = await axios.get(`http://localhost:8080/api/messaging/conversations/${conversation._id}/messages`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        console.log('✅ Messages retrieved successfully');
        console.log('Messages count:', messagesResponse.data.data?.length || 0);
      } catch (error) {
        console.log('❌ Message retrieval failed:', error.response?.data || error.message);
      }
    }
    
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
    console.error('Status:', error.response?.status);
  }
}

debugConversationDetailed();

