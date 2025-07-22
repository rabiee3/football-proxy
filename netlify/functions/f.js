const path = require('path');
const fs = require('fs');

exports.handler = async function(event, context) {
  const recipesPath = path.resolve(__dirname, 'recipes.json');
  const data = JSON.parse(fs.readFileSync(recipesPath, 'utf8'));

  const { id } = event.queryStringParameters;

  if (id) {
    const recipe = data.find(r => r.id === parseInt(id));
    if (recipe) {
      return {
        statusCode: 200,
        body: JSON.stringify(recipe)
      };
    } else {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: "Recipe not found" })
      };
    }
  }

  // No ID: return all recipes
  return {
    statusCode: 200,
    body: JSON.stringify(data)
  };
};