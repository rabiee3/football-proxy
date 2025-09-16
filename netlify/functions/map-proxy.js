const axios = require("axios");
const https = require("https");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

const httpsAgent = new https.Agent({ rejectUnauthorized: false });

exports.handler = async function (event, context) {
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: "",
    };
  }

  try {
    const baseMapUrl = "https://erf-map.vercel.app";
    const path = event.path.replace("/.netlify/functions/map-proxy", "");
    const queryString = event.rawQueryString ? `?${event.rawQueryString}` : "";
    const targetUrl = `${baseMapUrl}${path}${queryString}`;

    // Fetch the content
    const res = await axios.get(targetUrl, {
      responseType: "arraybuffer", // preserve binary for images/tiles
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 " +
          "(KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36",
        Accept: "*/*",
        "Accept-Language": "en-US,en;q=0.9",
        Referer: baseMapUrl,
        Origin: baseMapUrl,
      },
      httpsAgent,
    });

    // Determine content type
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
    console.error("Proxy error:", err);
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
