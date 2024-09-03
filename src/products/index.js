const express = require("express");

const { ProductsController } = require('./controller');

const router = express.Router();

module.exports.ProductsAPI = (app) => {
  router
    .get("/", ProductsController.getProducts) // http://localhost:3000/api/products/
    .get("/report", ProductsController.generateReport)
    .get("/:id", ProductsController.getProduct) // http://localhost:3000/api/products/11
    .post("/", ProductsController.createProduct)
    // update
    .post("/update", ProductsController.updateProduct)
    // delete
    .get("/delete/:id", ProductsController.deleteProduct) // http://localhost:3000/api/products/delete/11
  app.use("/api/products", router);
};
