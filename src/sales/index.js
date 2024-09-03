const express = require("express");
const { Config } = require('../config');

const { SalesController } = require('./controller');

const router = express.Router();

module.exports.SalesAPI = (app) => {
  router
    .get("/", SalesController.getSales) // http://localhost:3000/mongodb-api/api/sales/
    .get("/:id", SalesController.getSale) // http://localhost:3000/mongodb-api/api/sales/11
    .post("/", SalesController.createSale)
    // update
    .post("/update", SalesController.updateSale)
    // delete
    .get("/delete/:id", SalesController.deleteSale) // http://localhost:3000/mongodb-api/api/sales/delete/11
  app.use(`/${Config.projectName}/api/sales`, router);
};