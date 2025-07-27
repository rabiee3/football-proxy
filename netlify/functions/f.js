const axios = require('axios');
exports.handler = async function (event, context) {
  const { id } = event.queryStringParameters;
  const res = await axios.get('https://rabiee3-api.netlify.app/recipes.json');
  const data = res.data;

  if (id) {
    const recipe = data.find((r) => r.id === parseInt(id));
    if (recipe) {
      return {
        headers: { 
          "Content-Type": "application/json",
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': '*',
          'Access-Control-Allow-Methods': '*'
         },
        statusCode: 200,
        body: JSON.stringify(recipe),
      };
    } else {
      return {
        headers: { 
          "Content-Type": "application/json",
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': '*',
          'Access-Control-Allow-Methods': '*'
         },
        statusCode: 404,
        body: JSON.stringify({ error: "Recipe not found" }),
      };
    }
  }

  // No ID: return all recipes
  return {
    headers: { 
      "Content-Type": "application/json",
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': '*',
      'Access-Control-Allow-Methods': '*'
     },
    statusCode: 200,
    body: JSON.stringify(data),
  };
};
