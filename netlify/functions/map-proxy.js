// netlify/functions/map-proxy.js
const fetch = require('node-fetch');

exports.handler = async function(event, context) {
  try {
    const targetUrl = `https://meterops.ipesmart.co.za/map${event.path.replace('/.netlify/functions/map-proxy', '')}${event.rawQueryString ? '?' + event.rawQueryString : ''}`;

    const response = await fetch(targetUrl);
    const contentType = response.headers.get('content-type');

    const buffer = await response.arrayBuffer();
    const body = Buffer.from(buffer);

    return {
      statusCode: 200,
      headers: {
        'Content-Type': contentType || 'text/html',
        'Access-Control-Allow-Origin': '*'
      },
      body: body.toString('base64'),
      isBase64Encoded: true
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: 'Proxy error'
    };
  }
};
