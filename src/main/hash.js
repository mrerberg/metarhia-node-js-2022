'use strict';

const crypto = require('node:crypto');

const hash = (options) => (password) =>
  new Promise((resolve, reject) => {
    const salt = crypto.randomBytes(16).toString(options.encoding);

    crypto.scrypt(password, salt, 64, (err, result) => {
      if (err) reject(err);
      resolve(salt + ":" + result.toString(options.encoding));
    });
  });

module.exports = (options) => hash(options);
