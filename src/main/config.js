const config = {
  staticServer: {
    port: 8000,
  },
  api: {
    port: 8001,
  },
  dataBase: {
    host: "127.0.0.1",
    port: 5432,
    database: "example",
    user: "marcus",
    password: "marcus",
  },
  logger: {
    dirName: "log",
    name: "pino", // native, pino
  },
  cryptography: {
    encoding: "base64",
  },
  transport: "fastify", // http, ws, fastify
};


module.exports = config;
