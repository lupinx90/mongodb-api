const express = require("express");

const { SalesController } = require('./controller');

const router = express.Router();

module.exports.SalesAPI = (app) => {
  router
    .get("/", SalesController.getSales) // http://localhost:3000/api/sales/
    .get("/:id", SalesController.getSale) // http://localhost:3000/api/sales/11
    .post("/", SalesController.createSale)
    // update
    .put("/:id", SalesController.updateSale)
    // delete
    .delete("/:id", SalesController.deleteSale) // http://localhost:3000/api/sales/delete/11
  app.use("/api/sales", router);
};