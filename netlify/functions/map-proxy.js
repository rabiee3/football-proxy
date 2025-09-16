// netlify/functions/map-proxy.js
import fetch from 'node-fetch';

export async function handler(event, context) {
  try {
    // Construct the target URL
    const targetUrl = `https://meterops.ipesmart.co.za/map${event.path.replace('/.netlify/functions/map-proxy', '')}${event.rawQueryString ? '?' + event.rawQueryString : ''}`;

    // Fetch content from the original map server
    const response = await fetch(targetUrl);
    const contentType = response.headers.get('content-type');

    // Read content as buffer (supports images, JS, CSS, HTML)
    const buffer = await response.arrayBuffer();
    const body = Buffer.from(buffer);

    return {
      statusCode: 200,
      headers: {
        'Content-Type': contentType || 'text/html',
        'Access-Control-Allow-Origin': '*' // optional, for CORS
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
}
