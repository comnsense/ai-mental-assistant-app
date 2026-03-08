const logger = require('../utils/logger');

const errorHandler = (err, req, res, next) => {
  logger.error(err.stack);

  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';

  res.status(status).json({
    message,
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
};

module.exports = { errorHandler };