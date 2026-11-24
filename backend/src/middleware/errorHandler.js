/**
 * Central Error Handler
 */
const errorHandler = (err, req, res, next) => {
  console.error('[Error]', err.stack || err);

  // Prisma Known Errors
  if (err.code === 'P2002') {
    return res.status(409).json({
      success: false,
      message: 'A resource with this unique constraint already exists.',
      field: err.meta?.target,
    });
  }

  if (err.code === 'P2025') {
    return res.status(404).json({
      success: false,
      message: 'Requested record was not found.',
    });
  }

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

/**
 * 404 Route Not Found Handler
 */
const notFoundHandler = (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found`,
  });
};

module.exports = {
  errorHandler,
  notFoundHandler,
};
