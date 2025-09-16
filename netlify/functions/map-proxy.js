const axios = require("axios");
const https = require("https");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

// Create an https agent that ignores SSL errors
const httpsAgent = new https.Agent({
  rejectUnauthorized: false,
});

exports.handler = async function (event, context) {
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: "",
    };
  }

  try {
    const targetUrl = `https://meterops.ipesmart.co.za/map${event.path.replace(
      "/.netlify/functions/map-proxy",
      ""
    )}${event.rawQueryString ? "?" + event.rawQueryString : ""}`;

    const res = await axios.get(targetUrl, {
      responseType: "arraybuffer",
      headers: { "User-Agent": "Netlify Proxy" },
      httpsAgent, // ignore SSL issues
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
