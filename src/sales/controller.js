const debug = require("debug")("app:module-sales-controller");
const createError = require("http-errors");

const { ObjectId } = require("mongodb");

const { SalesService } = require("./services");
const { UsersService } = require("../users/services");
const { ProductsService } = require("../products/services");
const { Response } = require("../common/response");

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
      const products = body.products;
      if (userId.length !== 24) {
        Response.error(res, {
          statusCode: 400,
          message:
            "El usuario indicado no tiene la longitud necesaria - 24 caracteres",
        });
      } else {
        let user = await UsersService.getById(userId.toString());
        let productsInJSON = products && products.length >= 1 ? true : false;
        debug(user);
        debug(productsInJSON);
        if (!user || !productsInJSON) {
          Response.error(res, {
            statusCode: 404,
            message:
              "El usuario indicado no existe o no se han detectado productos",
          });
        } else {
          let productNotFound = false;
          products.forEach(async (item, i, array) => {
            let itemId = item.product_id;
            debug(itemId);
            if (itemId.length === 24) {
              let product = await ProductsService.getById(itemId.toString());
              if (!product) {
                productNotFound = true;
              }
            } else {
              productNotFound = true;
            }
          });
          debug(productNotFound);
          if (productNotFound) {
            Response.error(res, {
              statusCode: 404,
              message: "Alguno de los productos no se ha encontrado",
            });
          } else {
            const insertedId = await SalesService.create(body);
            Response.success(res, 201, `Venta agregada con éxito`, insertedId);
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
      const { body } = req;
      const updatedId =
        body._id && body._id.toString().length === 24
          ? body._id.toString()
          : null;
      if (!body || Object.keys(body).length <= 1 || !updatedId) {
        Response.error(res, new createError.BadRequest());
      } else {
        const updatedSale = await SalesService.update(body);
        debug(body);
        if (!updatedSale) {
          Response.error(res, new createError.NotFound());
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
      if (!id || id.length !== 24) {
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
