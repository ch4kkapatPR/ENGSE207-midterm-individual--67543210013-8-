// src/presentation/middlewares/errorHandler.js
function errorHandler(err, req, res, next) {
    console.error('Error:', err.message);

    let statusCode = 500;
    let message = err.message || 'Internal server error';

    switch (err.name) {
        case 'ValidationError':
            statusCode = 400;
            break;

        case 'NotFoundError':
            statusCode = 404;
            break;

        case 'ConflictError':
            statusCode = 409;
            break;

        default:
            statusCode = err.statusCode || 500;
            break;
    }

    res.status(statusCode).json({
        error: message
    });
}

module.exports = errorHandler;
