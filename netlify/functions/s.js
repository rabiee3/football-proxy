const axios = require("axios");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, x-api-key",
};

exports.handler = async function (event) {
  // Handle OPTIONS method for CORS preflight
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: "",
    };
  }

  const requestKey = event.headers["x-api-key"];
  const expectedKey = "rabiee3";
  const API_KEY = process.env.FOOTBAL_API;

  const { date, leagueId, fixtureId } = event.queryStringParameters || {};

  if (!requestKey || requestKey !== expectedKey) {
    return {
      statusCode: 401,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        error: "Unauthorized: Invalid or missing API key",
      }),
    };
  }

  if (!API_KEY) {
    return {
      statusCode: 500,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ error: "Missing FOOTBAL_API environment variable" }),
    };
  }

  let url = "";
  if (fixtureId) {
    url = `https://v3.football.api-sports.io/fixtures?id=${fixtureId}`;
  } else if (date) {
    url = `https://v3.football.api-sports.io/fixtures?date=${date}`;
  } else {
    return {
      statusCode: 400,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ error: 'Missing required "date" or "fixtureId"' }),
    };
  }

  try {
    const apiRes = await axios.get(url, {
      headers: { "x-apisports-key": API_KEY },
    });

    const data = apiRes.data;

    // Optional filter by league ID (if provided)
    if (!fixtureId && leagueId) {
      const idAsNumber = parseInt(leagueId);
      data.response = data.response.filter(
        (match) => match.league.id === idAsNumber
      );
    }

    return {
      statusCode: 200,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    };
  } catch (err) {
    return {
      statusCode: err.response?.status || 500,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        error: err.message,
        detail: err.response?.data || null,
      }),
    };
  }
};
