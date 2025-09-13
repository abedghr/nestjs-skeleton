// Test JWT parsing in browser-like environment
const testToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiIxZjA4NGFjOS1jMTUwLTY1MzAtYWI1NC1kNDljYTIzMDc5ODkiLCJ0eXBlIjoiU1VQRVJfQURNSU4iLCJzdGF0dXMiOiJBQ1RJVkUiLCJtb2JpbGVOdW1iZXIiOiIrOTYyNzkwMDAwMDAwIiwicm9sZSI6IjFmMDg0YWM3LWRhNGYtNjc5MC1hZmNlLWRkNTNhZjIyYzgxNiIsImVtYWlsIjoic3VwZXJhZG1pbkBnbG93YXBwLmNvbSIsInBlcm1pc3Npb25zIjpbeyJzdWJqZWN0IjoiQUxMIiwiYWN0aW9uIjoiMCJ9LHsic3ViamVjdCI6IkFVVEgiLCJhY3Rpb24iOiIwIn0seyJzdWJqZWN0IjoiU0VUVElORyIsImFjdGlvbiI6IjAifSx7InN1YmplY3QiOiJDT1VOVFJZIiwiYWN0aW9uIjoiMCJ9LHsic3ViamVjdCI6IlJPTEUiLCJhY3Rpb24iOiIwIn0seyJzdWJqZWN0IjoiVVNFUiIsImFjdGlvbiI6IjAifSx7InN1YmplY3QiOiJCQU5ORVIiLCJhY3Rpb24iOiIwIn0seyJzdWJqZWN0IjoiQ0FURUdPUlkiLCJhY3Rpb24iOiIwIn0seyJzdWJqZWN0IjoiTk9USUZJQ0FUSU9OIiwiYWN0aW9uIjoiMCJ9XSwibG9naW5EYXRlIjoiMjAyNS0wOC0zMFQwNzozNjoxNS4wNTJaIiwibG9naW5Gcm9tIjoiQ1JFREVOVElBTCIsImlhdCI6MTc1NjUzOTM3NSwibmJmIjoxNzU2NTM5Mzc1LCJleHAiOjE3NTY2MjU3NzUsImF1ZCI6Ik5lc3RKc1RlbXBsYXRlIiwiaXNzIjoiaHR0cHM6Ly9leGFtcGxlLmNvbSIsInN1YiI6Iis5NjI3OTAwMDAwMDAifQ.ispidQHENC3pWguOrGnY8Vzia8msM7EaJEXG1ZRKFHY";

// Browser-compatible JWT parsing
const parseJwt = (token) => {
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
};

const extractUserIdFromToken = (token) => {
  const payload = parseJwt(token);
  return payload ? payload._id : null;
};

// Test the function
console.log('🔍 Testing JWT parsing...');
const userId = extractUserIdFromToken(testToken);
console.log('Extracted user ID:', userId);
console.log('Expected user ID: 1f084ac9-c150-6530-ab54-d49ca2307989');
console.log('Match:', userId === '1f084ac9-c150-6530-ab54-d49ca2307989' ? '✅' : '❌');

// Test with Node.js Buffer method for comparison
const Buffer = require('buffer').Buffer;
const nodePayload = JSON.parse(Buffer.from(testToken.split('.')[1], 'base64').toString());
console.log('Node.js method user ID:', nodePayload._id);
console.log('Both methods match:', userId === nodePayload._id ? '✅' : '❌');

