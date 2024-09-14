const debug = require("debug")("app:module-products-controller");
const createError = require("http-errors");

const { ProductsService } = require("./services");
const { Response } = require("../common/response");
const { Config } = require('../config');

const PRODUCT_ALLOWED_PROPERTIES = ["name", "precio", "cantidad"];
const MONGO_ID_LENGTH = +Config.mongoIdLength;

module.exports.ProductsController = {

  getProducts: async (req, res) => {
    try {
      let products = await ProductsService.getAll();
      Response.success(res, 200, "Lista de productos", products);
    } catch (error) {
      debug(error);
      Response.error(res);
    }
  },
  getProduct: async (req, res) => {
    try {
      const id = req.params.id;
      let product = await ProductsService.getById(id);
      if (!product) {
        Response.error(res, new createError.NotFound());
      } else {
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
      const propertyKeys = Object.keys(body);
      const wrongKeyIndex = propertyKeys.findIndex(
        (key) => !PRODUCT_ALLOWED_PROPERTIES.includes(key)
      );
      if (
        !body ||
        propertyKeys.length !== PRODUCT_ALLOWED_PROPERTIES.length ||
        wrongKeyIndex !== -1
      ) {
        Response.error(
          res,
          new createError.BadRequest("No se ha recibido un payload adecuado")
        );
      } else {
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
      const updateId = req.params.id;
      if (!updateId || updateId.length !== MONGO_ID_LENGTH) {
        Response.error(
          res,
          new createError.BadRequest(
            "El id a actualizar no tiene el formato correcto"
          )
        );
      } else {
        const { body } = req;
        const propertyKeys = Object.keys(body);
        const wrongKeyIndex = propertyKeys.findIndex(
          (key) => !PRODUCT_ALLOWED_PROPERTIES.includes(key)
        );
        if (
          !body ||
          propertyKeys.length > PRODUCT_ALLOWED_PROPERTIES.length ||
          wrongKeyIndex !== -1
        ) {
          Response.error(
            res,
            new createError.BadRequest(
              "El payload no es correcto, debe incluir solamente propiedades del producto original (excepto id)"
            )
          );
        } else {
          const updatedProduct = await ProductsService.update(updateId, body);
          if (!updatedProduct) {
            Response.error(
              res,
              new createError.NotFound("Producto no encontrado")
            );
          } else {
            Response.success(
              res,
              200,
              `Producto ${updateId} actualizado`,
              updatedProduct
            );
          }
        }
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
      if (!id || id.length !== MONGO_ID_LENGTH) {
        Response.error(res, new createError.BadRequest());
      } else {
        const deletedProduct = await ProductsService.deleteProduct(id);
        if (!deletedProduct) {
          Response.error(res, new createError.NotFound());
        } else {
          Response.success(
            res,
            200,
            `Producto ${id} eliminado`,
            deletedProduct
          );
        }
      }
    } catch (error) {
      debug(error);
      Response.error(res);
    }
  },
  generateReport: async (req, res) => {
    try {
      ProductsService.generateReport("Inventario", res);
    } catch (error) {
      debug(error);
      Response.error(res);
    }
  },
};
