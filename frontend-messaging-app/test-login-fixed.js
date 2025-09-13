const axios = require('axios');

async function testLoginFixed() {
  try {
    console.log('Testing login API with correct endpoint...');
    
    const loginData = {
      username: 'superadmin',
      password: 'Admin@1234',
      source: 'DASHBOARD'
    };
    
    console.log('Login payload:', loginData);
    
    // Test with the correct endpoint
    const response = await axios.post('http://localhost:8080/api/public/auth/login', loginData, {
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 10000
    });
    
    console.log('✅ Login successful!');
    console.log('Response status:', response.status);
    console.log('Response data:', JSON.stringify(response.data, null, 2));
    
    // Test if we can use the token
    const token = response.data.data.tokens.accessToken;
    console.log('Token received:', token ? 'Yes' : 'No');
    
    if (token) {
      console.log('Testing token usage...');
      
      // Test a protected endpoint
      const userResponse = await axios.get('http://localhost:8080/api/v1/user/profile', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('User profile response:', JSON.stringify(userResponse.data, null, 2));
    }
    
  } catch (error) {
    console.error('❌ Login test failed:');
    console.error('Status:', error.response?.status);
    console.error('Status text:', error.response?.statusText);
    console.error('Headers:', error.response?.headers);
    console.error('Data:', error.response?.data);
    console.error('Error message:', error.message);
  }
}

testLoginFixed();
