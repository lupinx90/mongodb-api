const express = require("express");
const { Config } = require('../config');

const { UsersController } = require('./controller');

const router = express.Router();

module.exports.UsersAPI = (app) => {
  router
    .get("/", UsersController.getUsers) // http://localhost:3000/mongodb-api/api/users/
    .get("/:id", UsersController.getUser) // http://localhost:3000/mongodb-api/api/users/11
    .post("/", UsersController.createUser)
    // update
    .post("/update", UsersController.updateUser)
    // delete
    .get("/delete/:id", UsersController.deleteUser) // http://localhost:3000/mongodb-api/api/users/delete/11
  app.use(`/${Config.projectName}/api/users`, router);
};