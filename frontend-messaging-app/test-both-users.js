const axios = require('axios');

const API_BASE_URL = 'http://localhost:8080/api/public';

async function testUserLogin(username, password) {
  try {
    console.log(`\n🔐 Testing login for: ${username}`);
    
    const response = await axios.post(`${API_BASE_URL}/auth/login`, {
      username: username,
      password: password,
      source: 'DASHBOARD'
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    console.log(`✅ Login successful for ${username}`);
    console.log(`   User ID: ${response.data.data.user._id}`);
    console.log(`   Username: ${response.data.data.user.username}`);
    console.log(`   First Name: ${response.data.data.user.firstName}`);
    console.log(`   Access Token: ${response.data.data.tokens.accessToken.substring(0, 20)}...`);
    
    return response.data.data;
  } catch (error) {
    console.log(`❌ Login failed for ${username}:`, error.response?.data?.message || error.message);
    return null;
  }
}

async function testProtectedEndpoint(accessToken, endpoint) {
  try {
    const response = await axios.get(`http://localhost:8080/api${endpoint}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });
    console.log(`✅ ${endpoint} - Success`);
    return true;
  } catch (error) {
    console.log(`❌ ${endpoint} - Failed:`, error.response?.status, error.response?.data?.message);
    return false;
  }
}

async function main() {
  console.log('🚀 Testing both users login and API access\n');
  
  // Test both users
  const superadminResult = await testUserLogin('superadmin', 'Admin@1234');
  const superadmin1Result = await testUserLogin('superadmin1', 'Admin@1234');
  
  if (superadminResult) {
    console.log('\n🔍 Testing protected endpoints for superadmin:');
    await testProtectedEndpoint(superadminResult.tokens.accessToken, '/messaging/conversations');
    await testProtectedEndpoint(superadminResult.tokens.accessToken, '/user/profile');
  }
  
  if (superadmin1Result) {
    console.log('\n🔍 Testing protected endpoints for superadmin1:');
    await testProtectedEndpoint(superadmin1Result.tokens.accessToken, '/messaging/conversations');
    await testProtectedEndpoint(superadmin1Result.tokens.accessToken, '/user/profile');
  }
  
  console.log('\n📋 Summary:');
  console.log(`   superadmin: ${superadminResult ? '✅ Login OK' : '❌ Login Failed'}`);
  console.log(`   superadmin1: ${superadmin1Result ? '✅ Login OK' : '❌ Login Failed'}`);
  
  if (superadminResult && superadmin1Result) {
    console.log('\n🎉 Both users can login successfully!');
    console.log('   You can now test the messaging app with both users.');
    console.log('   Each user will see the other user in their contact list.');
  }
}

main().catch(console.error);
