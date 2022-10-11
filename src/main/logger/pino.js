"use strict";

const fs = require("node:fs");
const path = require("node:path");
const pino = require("pino");

class PinoLogger {
  constructor(logPath) {
    this.path = logPath;
    const date = new Date().toISOString().substring(0, 10);
    const filePath = path.join(logPath, `${date}.log`);


    if (!fs.existsSync(logPath)) {
      fs.mkdirSync(logPath);
    }

    this.pino = pino(
      {
        transport: {
          target: "pino-pretty",
        },
      },
      pino.destination({
        dest: filePath,
        sync: true,
      })
    );
  }

  log(...args) {
    this.pino.info(...args);
  }

  dir(...args) {
    this.pino.info(...args);
  }

  debug(...args) {
    this.pino.debug(...args);
  }

  error(...args) {
    this.pino.error(...args);
  }

  system(...args) {
    this.pino.info(...args);
  }

  access(...args) {
    this.pino.info(...args);
  }
}

module.exports = PinoLogger;
