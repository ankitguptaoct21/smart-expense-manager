import app from "./app.js";
import appConfig from "./config/index.js";
import db from "./config/db.js";

let server;

(async () => {
    try {
        // Connecting to Database - MongoDB
        await db.connectToDb();

        // Starting the server
        server = app.listen(appConfig.port, () => {
            console.log("************************************************");
            console.log("App Server Information:")
            console.log(`Server is listening on port: ${appConfig.port}`)
            console.log(`Server is running on environment: ${appConfig.node_env}`);
            console.log(`Server is connected to database: ${appConfig.db.url}`);
            console.log("************************************************");
        });
    } catch (error) {
        console.error("Failed to start server:", error);
        process.exit(1);
    }
})();

// Graceful shutdown
const gracefulShutdown = async (signal) => {
    console.log(`\n${signal} received. Starting graceful shutdown...`);
    
    if (server) {
        server.close(async () => {
            console.log("HTTP server closed.");
            
            try {
                await db.disconnectToDb();
                console.log("Database connection closed.");
                process.exit(0);
            } catch (error) {
                console.error("Error during shutdown:", error);
                process.exit(1);
            }
        });

        // Force close after 10 seconds
        setTimeout(() => {
            console.error("Forced shutdown after timeout");
            process.exit(1);
        }, 10000);
    } else {
        process.exit(0);
    }
};

process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
    console.error("Unhandled Promise Rejection:", err);
    gracefulShutdown("unhandledRejection");
});

// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
    console.error("Uncaught Exception:", err);
    gracefulShutdown("uncaughtException");
});
