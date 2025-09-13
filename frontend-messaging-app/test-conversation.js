const axios = require('axios');

async function testConversationCreation() {
  try {
    console.log('🔍 Testing conversation creation...\n');
    
    // First login to get token
    const loginResponse = await axios.post('http://localhost:8080/api/public/auth/login', {
      username: 'superadmin',
      password: 'Admin@1234',
      source: 'DASHBOARD'
    });
    
    const token = loginResponse.data.data.tokens.accessToken;
    console.log('✅ Login successful');
    
    // Create conversation
    const conversationResponse = await axios.post('http://localhost:8080/api/messaging/conversations', {
      otherUserId: '1f085703-eb47-62d0-95e9-c440b3528e05' // superadmin1
    }, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('\n📋 Conversation creation response:');
    console.log(JSON.stringify(conversationResponse.data, null, 2));
    
    const conversation = conversationResponse.data.data;
    
    console.log('\n🔍 Conversation structure:');
    console.log('_id:', conversation._id);
    console.log('participants:', conversation.participants);
    console.log('type:', conversation.type);
    console.log('lastMessage:', conversation.lastMessage);
    
    // Try to get messages for this conversation
    console.log('\n🔍 Testing message retrieval...');
    const messagesResponse = await axios.get(`http://localhost:8080/api/messaging/conversations/${conversation._id}/messages`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('✅ Messages retrieved successfully');
    console.log('Messages count:', messagesResponse.data.data?.length || 0);
    
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
    console.error('Status:', error.response?.status);
  }
}

testConversationCreation();

