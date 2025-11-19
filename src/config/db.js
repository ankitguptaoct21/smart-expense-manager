import mongoose from "mongoose";
import appConfig from "./index.js";

const dbConnectionUrl = appConfig.db.url;

// recommended for safety
mongoose.set("strictQuery", true);
mongoose.set("strict", true);
mongoose.set("runValidators", true);
mongoose.set("returnOriginal", false);
mongoose.set("debug", appConfig.node_env === "development");
mongoose.set("bufferCommands", false);

const connectToDb = async () => {
    try {
        console.log("Connecting to MongoDB...");

        await mongoose.connect(dbConnectionUrl, {
            maxPoolSize: 10,
            serverSelectionTimeoutMS: 5000,
            connectTimeoutMS: 5000
        });

        console.log(`MongoDB connected: ${mongoose.connection.host}`);
    } catch (error) {
        console.error(`MongoDB connection error: ${error.message}`);
        // Fail fast — server should NEVER run without DB in a monolith
        process.exit(1);
    }
}

// Graceful shutdown
mongoose.connection.on("disconnected", () => {
    console.warn("MongoDB disconnected");
});

mongoose.connection.on("error", err => {
    console.error("MongoDB error:", err);
});

// Close DB cleanly when app stops
const disconnectToDb = async () => {
    await mongoose.connection.close();
    console.log("MongoDB connection closed");
};

export default { connectToDb, disconnectToDb }
