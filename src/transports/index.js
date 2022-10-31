const transports = {
  http: require("./http.js"),
  ws: require("./ws.js"),
  fastify: require("./fastify.js"),
};

const transportContext = (transport) => {
  const server = transports[transport] || transports.http;

  return server;
};

module.exports = (transport) => transportContext(transport);
