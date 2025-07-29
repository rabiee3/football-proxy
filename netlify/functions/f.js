const axios = require("axios");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, x-api-key",
};

exports.handler = async function (event, context) {
  // Handle CORS preflight request
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: "",
    };
  }

  const { id } = event.queryStringParameters || {};

  try {
    const res = await axios.get("https://rabiee3-api.netlify.app/recipes.json");
    const data = res.data;

    if (id) {
      const recipe = data.find((r) => r.id === parseInt(id));
      if (recipe) {
        return {
          statusCode: 200,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(recipe),
        };
      } else {
        return {
          statusCode: 404,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ error: "Recipe not found" }),
        };
      }
    }

    // Return all recipes
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
      statusCode: 500,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        error: "Failed to fetch recipes",
        detail: err.message,
      }),
    };
  }
};
