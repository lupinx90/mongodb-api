const debug = require("debug")("app:module-sales-controller");
const createError = require("http-errors");

const { SalesService } = require("./services");
const { UsersService } = require("../users/services");
const { ProductsService } = require("../products/services");
const { Response } = require("../common/response");
const { Config } = require("../config");

const PRODUCT_ALLOWED_PROPERTIES = ["product_id", "qty"];
const SALE_ALLOWED_PROPERTIES = ["user_id", "products"];
const MONGO_ID_LENGTH = +Config.mongoIdLength;

module.exports.SalesController = {
  getSales: async (req, res) => {
    try {
      let sales = await SalesService.getAll();
      Response.success(res, 200, "Lista de ventas", sales);
    } catch (error) {
      debug(error);
      Response.error(res);
    }
  },
  getSale: async (req, res) => {
    try {
      const id = req.params.id;
      let sale = await SalesService.getById(id);
      if (!sale) {
        Response.error(res, new createError.NotFound());
      } else {
        Response.success(res, 200, `Venta ${id}`, sale);
      }
    } catch (error) {
      debug(error);
      Response.error(res);
    }
  },
  createSale: async (req, res) => {
    try {
      const { body } = req;
      const userId = body.user_id;
      if (userId.length !== MONGO_ID_LENGTH) {
        Response.error(res, {
          statusCode: 400,
          message: "El usuario indicado no tiene el formato correcto",
        });
      } else {
        let user = await UsersService.getById(userId.toString());
        const products = body.products;
        let productsInJSON = products && products.length >= 1 ? true : false;
        const salePropertyKeys = Object.keys(body);
        const wrongSaleKeyIndex = salePropertyKeys.findIndex(
          (key) => !SALE_ALLOWED_PROPERTIES.includes(key)
        );
        if (
          !user ||
          !productsInJSON ||
          salePropertyKeys.length !== SALE_ALLOWED_PROPERTIES.length ||
          wrongSaleKeyIndex !== -1
        ) {
          Response.error(res, {
            statusCode: 400,
            message:
              "El usuario indicado no existe, no se han detectado productos o bien se ha detectado un payload incorrecto",
          });
        } else {
          let wrongProduct = false;
          const promises = products.map(async (item) => {
            let itemId = item.product_id;
            const productPropertyKeys = Object.keys(item);
            const wrongProductKeyIndex = productPropertyKeys.findIndex(
              (key) => !PRODUCT_ALLOWED_PROPERTIES.includes(key)
            );
            if (
              itemId.length !== MONGO_ID_LENGTH ||
              productPropertyKeys.length !==
                PRODUCT_ALLOWED_PROPERTIES.length ||
              wrongProductKeyIndex !== -1
            ) {
              wrongProduct = true;
            } else {
              const item = await ProductsService.getById(itemId);
              if (!item) wrongProduct = true;
            }
          });
          await Promise.all(promises);
          if (wrongProduct) {
            Response.error(res, {
              statusCode: 400,
              message: "Alguno de los productos tiene un payload incorrecto",
            });
          } else {
            const sale = await SalesService.create(body);
            if (!sale) {
              Response.error(res, {
                statusCode: 400,
                message: "Alguno de los productos tiene un payload incorrecto",
              });
            } else {
              Response.success(res, 201, `Venta agregada con éxito`, sale);
            }
          }
        }
      }
    } catch (error) {
      debug(error);
      Response.error(res);
    }
  },
  // update
  updateSale: async (req, res) => {
    try {
      const updatedId = req.params.id;
      const { body } = req;
      const { products, user_id } = body;
      const salePropertyKeys = Object.keys(body);
      const wrongSaleKeyIndex = salePropertyKeys.findIndex(
        (key) => !SALE_ALLOWED_PROPERTIES.includes(key)
      );
      if (
        !body ||
        Object.keys(body).length < 1 ||
        wrongSaleKeyIndex !== -1 ||
        !updatedId ||
        updatedId.length !== MONGO_ID_LENGTH
      ) {
        Response.error(
          res,
          new createError.BadRequest("El payload no es correcto")
        );
      } else {
        if (user_id) {
          if (user_id.length !== MONGO_ID_LENGTH) {
            Response.error(res, {
              statusCode: 400,
              message:
                "El id de usuario proporcionado no tiene la longitud correcta",
            });
            return;
          } else {
            const user = await UsersService.getById(user_id);
            if (!user) {
              Response.error(res, {
                statusCode: 400,
                message: "El usuario indicado no existe en la base de datos",
              });
              return;
            }
          }
        }
        if (products) {
          let wrongProduct = false;
          const promises = products.map(async (item) => {
            let itemId = item.product_id;
            const productPropertyKeys = Object.keys(item);
            const wrongProductKeyIndex = productPropertyKeys.findIndex(
              (key) => !PRODUCT_ALLOWED_PROPERTIES.includes(key)
            );
            if (
              itemId.length !== MONGO_ID_LENGTH ||
              productPropertyKeys.length !==
                PRODUCT_ALLOWED_PROPERTIES.length ||
              wrongProductKeyIndex !== -1
            ) {
              wrongProduct = true;
            } else {
              const item = await ProductsService.getById(itemId);
              if (!item) wrongProduct = true;
            }
          });
          await Promise.all(promises);
          if (wrongProduct) {
            Response.error(res, {
              statusCode: 400,
              message: "Alguno de los productos tiene un payload incorrecto",
            });
            return;
          }
        }
        const updatedSale = await SalesService.update(updatedId, body);
        if (!updatedSale) {
          Response.error(
            res,
            new createError.NotFound("No se ha podido actualizar el pedido")
          );
        } else {
          Response.success(
            res,
            200,
            `Venta ${updatedId} actualizada`,
            updatedSale
          );
        }
      }
    } catch (error) {
      debug(error);
      Response.error(res);
    }
  },
  // delete
  deleteSale: async (req, res) => {
    try {
      const id = req.params.id;
      debug(id);
      if (!id || id.length !== MONGO_ID_LENGTH) {
        Response.error(res, new createError.BadRequest());
      } else {
        const deletedSale = await SalesService.deleteSale(id);
        if (!deletedSale) {
          Response.error(res, new createError.NotFound());
        } else {
          Response.success(res, 200, `Venta ${id} eliminada`, deletedSale);
        }
      }
    } catch (error) {
      debug(error);
      Response.error(res);
    }
  },
};
