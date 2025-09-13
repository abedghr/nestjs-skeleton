const axios = require('axios');

const API_BASE_URL = 'http://localhost:8080/api';

async function testConversationsList() {
  try {
    console.log('🔍 Testing Conversations List...\n');

    // Step 1: Login as superadmin
    console.log('1. Logging in as superadmin...');
    const loginResponse = await axios.post(`${API_BASE_URL}/public/auth/login`, {
      username: 'superadmin',
      password: 'Admin@1234',
      source: 'DASHBOARD'
    });
    
    const { accessToken } = loginResponse.data.data.tokens;
    console.log('✅ Login successful\n');

    // Step 2: Get conversations list
    console.log('2. Getting conversations list...');
    const conversationsResponse = await axios.get(`${API_BASE_URL}/messaging/conversations`, {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    
    console.log('✅ Conversations response status:', conversationsResponse.status);
    console.log('✅ Conversations response data:', JSON.stringify(conversationsResponse.data, null, 2));
    
    if (conversationsResponse.data.data && conversationsResponse.data.data.length > 0) {
      console.log('✅ Found conversations:', conversationsResponse.data.data.length);
      conversationsResponse.data.data.forEach((conv, index) => {
        console.log(`   Conversation ${index + 1}:`, conv);
      });
    } else {
      console.log('⚠️  No conversations found or empty data');
    }

    // Step 3: Try to get a specific conversation if one exists
    if (conversationsResponse.data.data && conversationsResponse.data.data.length > 0) {
      const firstConversation = conversationsResponse.data.data[0];
      if (firstConversation._id) {
        console.log('\n3. Getting specific conversation details...');
        const conversationResponse = await axios.get(`${API_BASE_URL}/messaging/conversations/${firstConversation._id}`, {
          headers: { Authorization: `Bearer ${accessToken}` }
        });
        
        console.log('✅ Specific conversation response:', JSON.stringify(conversationResponse.data, null, 2));
      }
    }

  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
    console.error('Status:', error.response?.status);
  }
}

testConversationsList();

