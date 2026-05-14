const https = require('https');

const data = JSON.stringify({
  tasks: []
});

const options = {
  hostname: 'api.npoint.io',
  path: '/',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

const req = https.request(options, (res) => {
  let responseData = '';
  res.on('data', (chunk) => {
    responseData += chunk;
  });
  res.on('end', () => {
    console.log(responseData);
  });
});

req.on('error', (error) => {
  console.error(error);
});

req.write(data);
req.end();
