const debug = require("debug")("app:module-users-controller");
const createError = require('http-errors');

const { UsersService } = require("./services");
const { Response } = require('../common/response');

module.exports.UsersController = {
  getUsers: async (req, res) => {
    try {
      let users = await UsersService.getAll();
      Response.success(res, 200, 'Lista de usuarios', users);
    } catch (error) {
      debug(error);
      Response.error(res);
    }
  },
  getUser: async (req, res) => {
    try {
      const id = req.params.id;
      let user = await UsersService.getById(id);
      if(!user){
        Response.error(res, new createError.NotFound());
      }else{
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
      if(!body || Object.keys(body).length === 0){
        Response.error( res, new createError.BadRequest());
      }else{
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
      const { body } = req;
      const updatedId = (body._id && body._id.toString().length === 24) ? body._id.toString() : null;
      if(!body || Object.keys(body).length <= 1 || !updatedId){
        Response.error( res, new createError.BadRequest());
      }else{
        const updatedUser = await UsersService.update(body);
        debug(body);
        if(!updatedUser){
          Response.error( res, new createError.NotFound());
        }else{
          Response.success(res, 200, `Usuario ${updatedId} actualizado`, updatedUser);
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
      debug(id);
      if(!id || id.length !== 24){
        Response.error( res, new createError.BadRequest());
      }else{
        const deletedUser = await UsersService.deleteUser(id);
        if(!deletedUser){
          Response.error( res, new createError.NotFound());
        }else{
          Response.success(res, 200, `Usuario ${id} eliminado`, deletedUser);
        }
      }
    } catch (error) {
      debug(error);
      Response.error(res);
    }
  },
};
