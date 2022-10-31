"use strict";

const http = require("node:http");

const receiveArgs = async (req) => {
  const buffers = [];
  for await (const chunk of req) buffers.push(chunk);
  const data = Buffer.concat(buffers).toString();
  return JSON.parse(data);
};

const HEADERS = {
  // TODO: Что за заголовки?
  "X-XSS-Protection": "1; mode=block",
  "X-Content-Type-Options": "nosniff",
  "Strict-Transport-Security": "max-age=31536000; includeSubdomains; preload",

  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
  "Content-Type": "application/json; charset=UTF-8",
};

module.exports = (routing, port, console) => {
  http
    .createServer(async (req, res) => {
      res.writeHead(200, HEADERS);

      if (req.method !== "POST") return res.end('"Not found"');

      const { url, socket } = req;
      const [name, method] = url.substring(1).split("/");
      const entity = routing[name];
      if (!entity) return res.end("Not found");
      const handler = entity[method];
      if (!handler) return res.end("Not found");

      console.log(`${socket.remoteAddress} ${method} ${url}`);
      const { args } = await receiveArgs(req);
      const result = await handler(args);

      if ("rows" in result) {
        res.end(JSON.stringify(result.rows));
        return;
      }
      res.end(JSON.stringify(result));
    })
    .listen(port);

  console.log(`API on port ${port}`);
};
