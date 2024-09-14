const debug = require("debug")("app:module-users-controller");
const createError = require("http-errors");

const { UsersService } = require("./services");
const { Response } = require("../common/response");
const { Config } = require("../config");

const USER_ALLOWED_PROPERTIES = ["name", "email"];
const MONGO_ID_LENGTH = +Config.mongoIdLength;

module.exports.UsersController = {
  getUsers: async (req, res) => {
    try {
      let users = await UsersService.getAll();
      Response.success(res, 200, "Lista de usuarios", users);
    } catch (error) {
      debug(error);
      Response.error(res);
    }
  },
  getUser: async (req, res) => {
    try {
      const id = req.params.id;
      let user = await UsersService.getById(id);
      if (!user) {
        Response.error(res, new createError.NotFound());
      } else {
        Response.success(res, 200, `Usuario ${id}`, user);
      }
    } catch (error) {
      debug(error);
      Response.error(res);
    }
  },
  createUser: async (req, res) => {
    try {
      const { body } = req;
      const propertyKeys = Object.keys(body);
      const wrongKeyIndex = propertyKeys.findIndex(
        (key) => !USER_ALLOWED_PROPERTIES.includes(key)
      );
      if (
        !body ||
        propertyKeys.length !== USER_ALLOWED_PROPERTIES.length ||
        wrongKeyIndex !== -1
      ) {
        Response.error(
          res,
          new createError.BadRequest("No se ha recibido un payload adecuado")
        );
      } else {
        const insertedId = await UsersService.create(body);
        Response.success(res, 201, `Usuario agregado`, insertedId);
      }
    } catch (error) {
      debug(error);
      Response.error(res);
    }
  },
  // update
  updateUser: async (req, res) => {
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
          (key) => !USER_ALLOWED_PROPERTIES.includes(key)
        );
        if (
          !body ||
          propertyKeys.length > USER_ALLOWED_PROPERTIES.length ||
          wrongKeyIndex !== -1
        ) {
          Response.error(res, new createError.BadRequest("El payload no es correcto, debe incluir solamente propiedades del producto original (excepto id)"));
        } else {
          const updatedUser = await UsersService.update(updateId, body);
          if (!updatedUser) {
            Response.error(res, new createError.NotFound());
          } else {
            Response.success(
              res,
              200,
              `Usuario ${updateId} actualizado`,
              updatedUser
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
  deleteUser: async (req, res) => {
    try {
      const id = req.params.id;
      if (!id || id.length !== 24) {
        Response.error(res, new createError.BadRequest());
      } else {
        const deletedUser = await UsersService.deleteUser(id);
        if (!deletedUser) {
          Response.error(res, new createError.NotFound());
        } else {
          Response.success(res, 200, `Usuario ${id} eliminado`, deletedUser);
        }
      }
    } catch (error) {
      debug(error);
      Response.error(res);
    }
  },
};
