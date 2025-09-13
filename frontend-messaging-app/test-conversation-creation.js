const axios = require('axios');

const API_BASE_URL = 'http://localhost:8080/api';

async function testConversationCreation() {
  try {
    console.log('🔍 Testing Conversation Creation...\n');

    // Step 1: Login as superadmin
    console.log('1. Logging in as superadmin...');
    const loginResponse = await axios.post(`${API_BASE_URL}/public/auth/login`, {
      username: 'superadmin',
      password: 'Admin@1234',
      source: 'DASHBOARD'
    });
    
    const { accessToken, user: currentUser } = loginResponse.data.data.tokens;
    console.log('✅ Login successful, got access token');
    console.log('✅ Current user data:', loginResponse.data.data.user);
    console.log('✅ Current user ID:', loginResponse.data.data.user._id, '\n');

    // Step 2: Get superadmin1 user data from the provided user objects
    console.log('2. Getting superadmin1 user data...');
    const superadmin1Data = {
      _id: '507f1f77bcf86cd799439011',
      username: 'superadmin1',
      firstName: 'Super',
      lastName: 'Admin1',
      email: 'superadmin1@example.com',
      mobileNumber: '+962790000011',
      role: 'SUPER_ADMIN',
      status: 'ACTIVE'
    };
    console.log('✅ Superadmin1 data:', superadmin1Data);
    console.log('✅ Superadmin1 ID:', superadmin1Data._id, '\n');

    // Step 4: Create conversation
    console.log('4. Creating conversation...');
    const conversationResponse = await axios.post(`${API_BASE_URL}/messaging/conversations`, {
      otherUserId: superadmin1Data._id
    }, {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    
    console.log('✅ Conversation response status:', conversationResponse.status);
    console.log('✅ Conversation response data:', conversationResponse.data);
    
    if (conversationResponse.data.data && Object.keys(conversationResponse.data.data).length > 0) {
      console.log('✅ Conversation created successfully with data');
    } else {
      console.log('⚠️  Conversation created but returned empty data object');
    }
    console.log();

    // Step 5: Get conversations list
    console.log('5. Getting conversations list...');
    const conversationsResponse = await axios.get(`${API_BASE_URL}/messaging/conversations`, {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    console.log('✅ Conversations list:', conversationsResponse.data);

  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
    console.error('Status:', error.response?.status);
  }
}

testConversationCreation();
