const path = require("path");
const fs = require("fs");

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

  const productsPath = path.resolve(__dirname, "../../data/products.json");
  const data = JSON.parse(fs.readFileSync(productsPath, "utf8"));

  const { id } = event.queryStringParameters;

  if (id) {
    const product = data.find((p) => p.id === parseInt(id));
    if (product) {
      return {
        statusCode: 200,
        body: JSON.stringify(product),
      };
    } else {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: "Product not found" }),
      };
    }
  }

  // Return all products if no id is provided
  return {
    statusCode: 200,
    body: JSON.stringify(data),
  };
};
