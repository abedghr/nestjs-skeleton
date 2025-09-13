const axios = require('axios');

function extractUserIdFromToken(token) {
  try {
    const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
    return payload._id;
  } catch (error) {
    console.error('Error extracting user ID from token:', error);
    return null;
  }
}

async function testUserIds() {
  try {
    console.log('🔍 Testing user ID extraction...\n');
    
    // Test superadmin
    const superadminResponse = await axios.post('http://localhost:8080/api/public/auth/login', {
      username: 'superadmin',
      password: 'Admin@1234',
      source: 'DASHBOARD'
    });
    
    const superadminToken = superadminResponse.data.data.tokens.accessToken;
    const superadminUserId = extractUserIdFromToken(superadminToken);
    
    console.log('superadmin:');
    console.log('  Username:', superadminResponse.data.data.user.username);
    console.log('  User ID from token:', superadminUserId);
    console.log('  Token payload:', JSON.parse(Buffer.from(superadminToken.split('.')[1], 'base64').toString()));
    
    // Test superadmin1
    const superadmin1Response = await axios.post('http://localhost:8080/api/public/auth/login', {
      username: 'superadmin1',
      password: 'Admin@1234',
      source: 'DASHBOARD'
    });
    
    const superadmin1Token = superadmin1Response.data.data.tokens.accessToken;
    const superadmin1UserId = extractUserIdFromToken(superadmin1Token);
    
    console.log('\nsuperadmin1:');
    console.log('  Username:', superadmin1Response.data.data.user.username);
    console.log('  User ID from token:', superadmin1UserId);
    console.log('  Token payload:', JSON.parse(Buffer.from(superadmin1Token.split('.')[1], 'base64').toString()));
    
    console.log('\n✅ User IDs extracted successfully!');
    console.log('   These IDs should match the mock user data in the frontend.');
    
  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

testUserIds();

