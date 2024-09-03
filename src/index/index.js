const express = require('express');
const createError = require('http-errors');
const { Config } = require('../config');

const { Response } = require('../common/response');

module.exports.IndexAPI = (app) => {
    const router = express.Router();
    
    router.get(`/`, (req, res) => {
        const menu = {
            products: `https://${req.headers.host}/${Config.projectName}/api/products`,
            users: `https://${req.headers.host}/${Config.projectName}/api/users`,
            sales: `https://${req.headers.host}/${Config.projectName}/api/sales`
        };

        Response.success(res, 200, "API Inventario", menu)
    })
    app.use(`/${Config.projectName}`, router);
}

module.exports.NotFoundAPI = (app) => {
    const router = express.Router();

    router.all("*", (req, res) => {
        Response.error(res, new createError.NotFound());
    });

    app.use("/", router);
}