const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';

// Test API endpoints
async function testAPI() {
  console.log('🧪 Testing Connectify Backend API...\n');

  try {
    // Test health check
    console.log('1. Testing health check...');
    const healthResponse = await axios.get(`${BASE_URL}/health`);
    console.log('✅ Health check passed:', healthResponse.data.message);

    // Test user registration
    console.log('\n2. Testing user registration...');
    const registerData = {
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123'
    };
    
    const registerResponse = await axios.post(`${BASE_URL}/auth/register`, registerData);
    console.log('✅ User registration successful:', registerResponse.data.message);

    // Test user login
    console.log('\n3. Testing user login...');
    const loginData = {
      email: 'test@example.com',
      password: 'password123'
    };
    
    const loginResponse = await axios.post(`${BASE_URL}/auth/login`, loginData);
    const token = loginResponse.data.data.token;
    console.log('✅ User login successful:', loginResponse.data.message);

    // Test protected route (get current user)
    console.log('\n4. Testing protected route...');
    const userResponse = await axios.get(`${BASE_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ Protected route access successful:', userResponse.data.data.user.username);

    // Test create channel
    console.log('\n5. Testing channel creation...');
    const channelData = {
      name: 'test-channel',
      description: 'A test channel',
      type: 'public'
    };
    
    const channelResponse = await axios.post(`${BASE_URL}/chat/channels`, channelData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ Channel creation successful:', channelResponse.data.message);

    // Test get channels
    console.log('\n6. Testing get channels...');
    const channelsResponse = await axios.get(`${BASE_URL}/chat/channels`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ Get channels successful:', channelsResponse.data.data.channels.length, 'channels found');

    console.log('\n🎉 All API tests passed successfully!');
    console.log('\n📡 Backend is ready for frontend integration!');
    console.log('🔗 Frontend should connect to: http://localhost:5000');
    console.log('🔌 Socket.io endpoint: http://localhost:5000');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

// Run tests
testAPI();
