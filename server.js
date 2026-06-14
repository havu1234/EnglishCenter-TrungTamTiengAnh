/**
 * Application Entry Point
 * Starts the Express server
 */

// Load dotenv if available (optional)
require("dotenv").config();

const app = require("./src/app");
const { connectDB } = require("./src/config/database");

const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || "development";

// Start server
const startServer = async () => {
  try {
    // Connect to database
    await connectDB();

    // Start listening
    const server = app.listen(PORT, () => {
      console.log(`

English Center Management System      
Server running on port ${PORT}          
Environment: ${NODE_ENV}               

      `);
    });

    // Graceful shutdown
    process.on("SIGTERM", () => {
      console.log("SIGTERM received, shutting down gracefully...");
      server.close(() => {
        console.log("Server closed");
        process.exit(0);
      });
    });

    process.on("SIGINT", () => {
      console.log("SIGINT received, shutting down gracefully...");
      server.close(() => {
        console.log("Server closed");
        process.exit(0);
      });
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
