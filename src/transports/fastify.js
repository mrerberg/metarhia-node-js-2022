"use strict";

const fastify = require("fastify")();
const cors = require("@fastify/cors");


const buildServiceRoutes = (serviceName, methods) => {
  const methodsNames = Object.keys(methods);
  const declarations = [];

  for (const methodName of methodsNames) {
    const handler = methods[methodName];

    if (!handler) continue;

    const url = `/${serviceName}/${methodName}`;
    declarations.push({
      url,
      method: "POST",
      handler: async function (request, reply) {
        const { args } = request.body;
        const result = await handler(args);

        if ("rows" in result) {
          reply.send(result.rows);
          return;
        }

        reply.send(result);
      },
    });
  }

  return declarations;
};

function buildRoutes(routing) {
  const servicesNames = Object.keys(routing);
  const servicesRoutes = [];

  for (const serviceName of servicesNames) {
    const routesDeclarations = buildServiceRoutes(
      serviceName,
      routing[serviceName]
    );

    servicesRoutes.push(...routesDeclarations);
  }

  return servicesRoutes;
}

function registerRoutes(routing) {
  const routes = buildRoutes(routing);

  routes.forEach((routeDeclaration) => fastify.route(routeDeclaration));
}

function registerPlugins() {
  fastify.register(cors, {
    origin: true,
  });
}

module.exports = (routing, port, console) => {
  registerRoutes(routing);
  registerPlugins();

  fastify.listen({ port: port }, (error, address) => {
    if (error) {
      console.error(error);
      process.exit(1);
    }

    console.log(`API on address ${address}`);
  });
};
