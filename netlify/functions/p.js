exports.handler = async function (event, context) {
  // Authorization check
  const requestKey = event.headers["x-api-key"];
  const expectedKey = "rabiee3";

  if (!requestKey || requestKey !== expectedKey) {
    return {
      headers: {
        "Content-Type": "application/json",
      },
      statusCode: 401,
      body: JSON.stringify({
        error:
          "Unauthorized: (Please don't forget x-api-key secret in the request header ya shabab)",
      }),
    };
  }

  const res = await axios.get('https://rabiee3-api.netlify.app/products.json');
  const data = res.data;

  const { id } = event.queryStringParameters;

  if (id) {
    const product = data.find((p) => p.id === parseInt(id));
    if (product) {
      return {
        headers: {
          "Content-Type": "application/json",
        },
        statusCode: 200,
        body: JSON.stringify(product),
      };
    } else {
      return {
        headers: {
          "Content-Type": "application/json",
        },
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
