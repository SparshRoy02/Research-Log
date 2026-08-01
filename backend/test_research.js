const axios = require('axios');

async function run() {
  try {
    console.log('Sending request to /api/research...');
    const response = await axios.post('http://localhost:5000/api/research', {
      topic: 'Benefits of using MERN Stack'
    }, {
      timeout: 120000 // 2 minutes timeout
    });

    console.log('Response status:', response.status);
    console.log('Research Topic:', response.data.topic);
    console.log('Research Status:', response.data.status);
    console.log('Generated Queries:', response.data.queries);
    console.log('Sources Crawled:', response.data.sources?.length);
    console.log('\nGenerated Report Preview:\n', response.data.report?.substring(0, 500) + '...\n');
  } catch (error) {
    console.error('Request failed:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

run();
