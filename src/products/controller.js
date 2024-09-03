const debug = require("debug")("app:module-products-controller");
const createError = require('http-errors');

const { ProductService, ProductsService } = require("./services");
const { Response } = require('../common/response');

module.exports.ProductsController = {
  getProducts: async (req, res) => {
    try {
      let products = await ProductsService.getAll();
      Response.success(res, 200, 'Lista de productos', products);
    } catch (error) {
      debug(error);
      Response.error(res);
    }
  },
  getProduct: async (req, res) => {
    try {
      const id = req.params.id;
      let product = await ProductsService.getById(id);
      if(!product){
        Response.error(res, new createError.NotFound());
      }else{
        Response.success(res, 200, `Producto ${id}`, product);  
      }
    } catch (error) {
      debug(error);
      Response.error(res);
    }
  },
  createProduct: async (req, res) => {
    try {
      const { body } = req;
      if(!body || Object.keys(body).length === 0){
        Response.error( res, new createError.BadRequest());
      }else{
        const insertedId = await ProductsService.create(body);
        Response.success(res, 201, `Producto agregado`, insertedId);
      }
    } catch (error) {
      debug(error);
      Response.error(res);
    }
  },
  // update
  updateProduct: async (req, res) => {
    try {
      const { body } = req;
      const updatedId = body._id ? body._id.toString() : null;
      if(!body || Object.keys(body).length <= 1 || !updatedId){
        Response.error( res, new createError.BadRequest());
      }else{
        const updatedProduct = await ProductsService.update(body);
        debug(body);
        Response.success(res, 200, `Producto ${updatedId} actualizado`, updatedProduct);
      }
    } catch (error) {
      debug(error);
      Response.error(res);
    }
  },
  // delete
  deleteProduct: async (req, res) => {
    try {
      const id = req.params.id;
      debug(id);
      if(!id || id.length !== 24){
        Response.error( res, new createError.BadRequest());
      }else{
        const deletedProduct = await ProductsService.deleteProduct(id);
        if(!deletedProduct){
          Response.error( res, new createError.NotFound());
        }else{
          Response.success(res, 200, `Producto ${id} eliminado`, deletedProduct);
        }
      }
    } catch (error) {
      debug(error);
      Response.error(res);
    }
  },
  generateReport: async (req, res) => {
    try {
      ProductsService.generateReport('Inventario', res);
    } catch (error) {
      debug(error);
      Response.error(res);
    }
  }
};
