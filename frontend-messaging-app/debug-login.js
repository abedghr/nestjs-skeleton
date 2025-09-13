const axios = require('axios');

async function debugLogin() {
  try {
    console.log('🔍 Debugging login response structure...\n');
    
    const response = await axios.post('http://localhost:8080/api/public/auth/login', {
      username: 'superadmin',
      password: 'Admin@1234',
      source: 'DASHBOARD'
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    console.log('✅ Login successful!');
    console.log('\n📋 Full response structure:');
    console.log(JSON.stringify(response.data, null, 2));
    
    console.log('\n🔍 User data structure:');
    console.log('userData._id:', response.data.data.user._id);
    console.log('userData.id:', response.data.data.user.id);
    console.log('userData.username:', response.data.data.user.username);
    console.log('userData.firstName:', response.data.data.user.firstName);
    
    console.log('\n🔍 Available user fields:');
    console.log(Object.keys(response.data.data.user));
    
  } catch (error) {
    console.error('❌ Login failed:', error.response?.data || error.message);
  }
}

debugLogin();

