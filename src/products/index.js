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
    .put("/:id", ProductsController.updateProduct)
    // delete
    .delete("/:id", ProductsController.deleteProduct) // http://localhost:3000/api/products/11
  app.use("/api/products", router);
};
