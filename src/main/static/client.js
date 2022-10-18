"use strict";


const servicesIterator = (structure, handler) => {
  const services = Object.keys(structure);

  for (const serviceName of services) {
    const service = structure[serviceName];
    const methods = Object.keys(service);

    for (const methodName of methods) {
      handler(service, serviceName, methodName);
    }
  }
};

const buildWsAPI = (url, structure) => {
  const api = {};
  const socket = new WebSocket(url);

  servicesIterator(structure, (service, serviceName, methodName) => {
    if (!api[serviceName]) {
      api[serviceName] = {};
    }

    api[serviceName][methodName] = (...args) =>
      new Promise((resolve) => {
        const packet = { name: serviceName, method: methodName, args };
        socket.send(JSON.stringify(packet));
        socket.onmessage = (event) => {
          const data = JSON.parse(event.data);
          resolve(data);
        };
      });
  });

  return new Promise((resolve) => {
    // TODO: socket.onopen?
    socket.addEventListener("open", () => resolve(api));
  });
};

const buildHttpAPI = (url, structure) => {
  const api = {};

  servicesIterator(structure, (service, serviceName, methodName) => {
    if (!api[serviceName]) {
      api[serviceName] = {};
    }

    api[serviceName][methodName] = (...args) =>
      new Promise((resolve, reject) => {
        const requestUrl = `${url}/${serviceName}/${methodName}`;

        // TODO: А как быть, если хочется id вкладывать в url?
        fetch(requestUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ args }),
        }).then((response) => {
          const { status } = response;

          if (status !== 200 && status !== 201) {
            reject(new Error(`Status Code: ${status}`));
          }

          resolve(response.json());
        });
      });
  });

  return Promise.resolve(api);
};

const scaffold = (url, structure) => {
  const protocol = url.startsWith("http") ? "http" : "ws";

  const transports = {
    ws: buildWsAPI,
    http: buildHttpAPI,
  };

  return transports[protocol](url, structure);
};

(async () => {
  const API_URL = "http://127.0.0.1:8001";

  const api = await scaffold(API_URL, {
    user: {
      create: ["record"],
      read: ["id"],
      update: ["id", "record"],
      delete: ["id"],
      find: ["mask"],
    },
    country: {
      read: ["id"],
      delete: ["id"],
      find: ["mask"],
    },
    talks: {
      say: ["message"],
    },
  });

   const data = await api.talks.say("hello");
   console.dir({ data });

  const data2 = await api.user.read(1);
  console.dir({ data2 });
})();
