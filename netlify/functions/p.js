const path = require('path');
const fs = require('fs');

exports.handler = async function(event, context) {
  const productsPath = path.resolve(__dirname, '../../data/products.json');
  const data = JSON.parse(fs.readFileSync(productsPath, 'utf8'));

  const { id } = event.queryStringParameters;

  if (id) {
    const product = data.find(p => p.id === parseInt(id));
    if (product) {
      return {
        statusCode: 200,
        body: JSON.stringify(product)
      };
    } else {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: "Product not found" })
      };
    }
  }

  // Return all products if no id is provided
  return {
    statusCode: 200,
    body: JSON.stringify(data)
  };
};
