const transports = {
  http: require("./http.js"),
  ws: require("./ws.js"),
  fastify: require("./fastify.js"),
};

const getTransport = (transport) => {
  const server = transports[transport] || transports.http;

  return server;
};

module.exports = (transport) => getTransport(transport);
