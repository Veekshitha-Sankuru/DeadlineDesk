/**
 * errorHandler - Centralized error handling middleware.
 * This runs when any route throws an error or calls next(error).
 * It formats the error response consistently so the frontend always
 * receives a predictable JSON structure.
 */
const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";

  // Mongoose Validation Error (e.g. required fields missing)
  if (err.name === "ValidationError") {
    statusCode = 400;
    // Combine all validation messages into one string
    message = Object.values(err.errors)
      .map((e) => e.message)
      .join(", ");
  }

  // Mongoose CastError — invalid MongoDB ObjectId format
  if (err.name === "CastError" && err.kind === "ObjectId") {
    statusCode = 400;
    message = "Invalid assignment ID format";
  }

  // Log server-side errors for debugging
  if (statusCode >= 500) {
    console.error("🔴 Server Error:", err);
  }

  res.status(statusCode).json({
    success: false,
    message,
  });
};

module.exports = errorHandler;
