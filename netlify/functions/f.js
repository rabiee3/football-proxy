exports.handler = async function (event, context) {
  const { id } = event.queryStringParameters;
  const res = await axios.get('https://rabiee3-api.netlify.app/recipes.json');
  const data = res.data;

  if (id) {
    const recipe = data.find((r) => r.id === parseInt(id));
    if (recipe) {
      return {
        statusCode: 200,
        body: JSON.stringify(recipe),
      };
    } else {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: "Recipe not found" }),
      };
    }
  }

  // No ID: return all recipes
  return {
    statusCode: 200,
    body: JSON.stringify(data),
  };
};
