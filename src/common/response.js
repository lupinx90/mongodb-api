const createError = require('http-errors');

module.exports.Response = {
    success: (res, status = 200, msg = "OK", body = {}) => {
        res.status(status).json({ msg, body });
    },
    error: (res, error = null) => {
        const { statusCode, message } = error ? error : new createError.InternalServerError();
        res.status(statusCode).json({ message });
    }
}