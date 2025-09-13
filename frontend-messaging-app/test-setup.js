// Simple test to verify the setup
console.log('Testing React app setup...');

// Test if we can import React
try {
  const React = require('react');
  console.log('✅ React import successful');
} catch (error) {
  console.error('❌ React import failed:', error.message);
}

// Test if we can import axios
try {
  const axios = require('axios');
  console.log('✅ Axios import successful');
} catch (error) {
  console.error('❌ Axios import failed:', error.message);
}

// Test if we can import socket.io-client
try {
  const io = require('socket.io-client');
  console.log('✅ Socket.io-client import successful');
} catch (error) {
  console.error('❌ Socket.io-client import failed:', error.message);
}

// Test basic API call
async function testAPI() {
  try {
    const axios = require('axios');
    console.log('Testing API connection...');
    
    const response = await axios.get('http://localhost:3000/api/v1/health', {
      timeout: 5000
    });
    console.log('✅ API connection successful:', response.status);
  } catch (error) {
    console.log('⚠️ API connection failed (this might be expected):', error.message);
  }
}

testAPI();

console.log('Setup test completed!');

