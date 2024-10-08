const { MongoClient } = require("mongodb");
const debug = require("debug")("app:module-database");

const { Config } = require('../config');

var connection = null;
module.exports.Database = (collection) =>
  new Promise(async (res, rej) => {
    try {
      if (!connection) {
        const client = new MongoClient(Config.mongoUri);
        connection = await client.connect();
        debug('Nueva conexión realizada con MongoDB Atlas');
      }
      debug('Reutilizando conexión');
      const db = connection.db(Config.mongoDbName);
      res(db.collection(collection));
    } catch (error) {
      rej(error);
    }
  });
