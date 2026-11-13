const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal server error";

  if (err.name === "CastError") {
    statusCode = 400;
    message = "Invalid id format";
  }

  if (err.name === "ValidationError") {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((e) => e.message)
      .join(", ");
  }

  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyPattern || {}).join(", ");
    message = `Duplicate value for field: ${field}`;
  }

  if (err.type === "entity.parse.failed") {
    statusCode = 400;
    message = "Invalid JSON body";
  }

  if (err.type === "entity.too.large") {
    statusCode = 413;
    message = "Request body too large";
  }

  if (statusCode >= 500) {
    // Log details server-side only; never leak internals to the client.
    console.error(err);
    message = "Internal server error";
  }

  res.status(statusCode).json({ message });
};

export default errorHandler;
