const express = require("express");
const { Config } = require('../config');

const { ProductsController } = require('./controller');

const router = express.Router();

module.exports.ProductsAPI = (app) => {
  router
    .get("/", ProductsController.getProducts) // http://localhost:3000/mongodb-api/api/products/
    .get("/report", ProductsController.generateReport)
    .get("/:id", ProductsController.getProduct) // http://localhost:3000/mongodb-api/api/products/11
    .post("/", ProductsController.createProduct)
    // update
    .post("/update", ProductsController.updateProduct)
    // delete
    .get("/delete/:id", ProductsController.deleteProduct) // http://localhost:3000/mongodb-api/api/products/delete/11
  app.use(`/${Config.projectName}/api/products`, router);
};
