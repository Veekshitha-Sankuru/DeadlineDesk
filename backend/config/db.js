const mongoose = require("mongoose");

/**
 * connectDB - Connects to MongoDB Atlas using the URI stored in environment variables.
 * Called once when the server starts.
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    // Exit the process if database connection fails
    process.exit(1);
  }
};

module.exports = connectDB;
