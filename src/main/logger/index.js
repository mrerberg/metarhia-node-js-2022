"use strict";

const path = require("node:path");

const loggers = {
  native: require("./native.js"),
  pino: require("./pino.js"),
};

const getLogger = (options) => {
  const { name, dirName } = options;
  const logPath = path.join(process.cwd(), `./${dirName}`);

  const Logger = loggers[name] || loggers.native;
  const logger = new Logger(logPath);

  return logger;
};

module.exports = (options) => getLogger(options);
