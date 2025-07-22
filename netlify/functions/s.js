const axios = require("axios");

exports.handler = async function (event, context) {
  // Authorization check
  const requestKey = event.headers["x-api-key"];
  const expectedKey = "rabiee3";

  if (!requestKey || requestKey !== expectedKey) {
    return {
      statusCode: 401,
      body: JSON.stringify({
        error:
          "Unauthorized: (Please don't forget x-api-key secret in the request header ya shabab)",
      }),
    };
  }

  const API_KEY = "8193377f2e3e92ac46c7ad11fcdf749c";

  const { date, type = "Friendly" } = event.queryStringParameters;

  if (!API_KEY) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "API key missing" }),
    };
  }

  const url = `https://v3.football.api-sports.io/fixtures?date=${date}`;

  try {
    const response = await axios.get(url, {
      headers: {
        "x-apisports-key": process.env.FOOTBAL_API,
      },
    });

    return {
      statusCode: 200,
      body: JSON.stringify(response.data),
    };
  } catch (err) {
    return {
      statusCode: err.response?.status || 500,
      body: JSON.stringify({
        error: err.message,
        detail: err.response?.data || null,
      }),
    };
  }
};
