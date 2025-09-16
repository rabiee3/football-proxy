const axios = require("axios");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

exports.handler = async function (event, context) {
  // Handle CORS preflight
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: "",
    };
  }

  try {
    // Build target URL (preserve query string and path)
    const targetUrl = `https://meterops.ipesmart.co.za/map${event.path.replace(
      "/.netlify/functions/map-proxy",
      ""
    )}${event.rawQueryString ? "?" + event.rawQueryString : ""}`;

    // Fetch the content
    const res = await axios.get(targetUrl, {
      responseType: "arraybuffer", // needed for images / tiles
      headers: {
        "User-Agent": "Netlify Proxy",
      },
    });

    const contentType = res.headers["content-type"] || "text/html";

    return {
      statusCode: 200,
      headers: {
        ...corsHeaders,
        "Content-Type": contentType,
      },
      body: Buffer.from(res.data, "binary").toString("base64"),
      isBase64Encoded: true,
    };
  } catch (err) {
    console.error(err);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({
        error: "Failed to fetch map",
        detail: err.message,
      }),
    };
  }
};
