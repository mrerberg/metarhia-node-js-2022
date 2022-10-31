"use strict";

const fsp = require("node:fs").promises;
const path = require("node:path");

const config = require("./config.js");
const staticServer = require("./static.js");
const load = require("./load.js");

// INFO: Прокидываем конфиги в main файле, чтобы не импортировать
// конфиги по всему приложению
const db = require("./db.js")(config.dataBase);
const hash = require("./hash.js")(config.cryptography);
const logger = require("./logger/index.js")(config.logger);
// Паттерн стратегия
const server = require("./transports/index.js")(config.transport);

const sandbox = {
  console: Object.freeze(logger),
  db: Object.freeze(db),
  common: Object.freeze({ hash }),
};
const apiPath = path.join(process.cwd(), "./api");
const routing = {};

(async () => {
  const files = await fsp.readdir(apiPath);
  for (const fileName of files) {
    if (!fileName.endsWith(".js")) continue;
    const filePath = path.join(apiPath, fileName);
    const serviceName = path.basename(fileName, ".js");
    routing[serviceName] = await load(filePath, sandbox);
  }


  // TODO: Бахнуть try catch в каждую функцию отдельно
  try {
    staticServer("./static", config.staticServer.port, logger);
    server(routing, config.api.port, logger);
  } catch (error) {
    // TODO: Пишется странный лог, плохо режется
     logger.error(error);
     throw new Error("Server error");
  }
})();
