import jwt from "jsonwebtoken";
import appConfig from "../config/index.js";

// Authentication middleware
export const authenticate = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ error: "Authentication required. Please provide a valid token." });
        }

        const token = authHeader.substring(7); // Remove "Bearer " prefix

        const decoded = jwt.verify(token, appConfig.jwt.secret);
        req.user = {
            userId: decoded.userId,
            role: decoded.role
        };

        next();
    } catch (error) {
        if (error.name === "JsonWebTokenError") {
            return res.status(401).json({ error: "Invalid token." });
        }
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({ error: "Token expired. Please login again." });
        }
        return next(error);
    }
};

// Error handling middleware
export const errorHandler = (err, req, res, next) => {
    // Mongoose validation error
    if (err.name === "ValidationError") {
        const errors = Object.values(err.errors).map(e => e.message);
        return res.status(400).json({ error: "Validation error", details: errors });
    }

    // Mongoose cast error (invalid ObjectId)
    if (err.name === "CastError") {
        return res.status(400).json({ error: "Invalid ID format." });
    }

    // JWT errors
    if (err.name === "JsonWebTokenError") {
        return res.status(401).json({ error: "Invalid token." });
    }

    if (err.name === "TokenExpiredError") {
        return res.status(401).json({ error: "Token expired. Please login again." });
    }

    // Default error
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal server error";

    // Log error in development
    if (appConfig.node_env === "development") {
        console.error("Error:", err);
    }

    res.status(statusCode).json({
        error: message,
        ...(appConfig.node_env === "development" && { stack: err.stack })
    });
};

// 404 handler
export const notFoundHandler = (req, res) => {
    res.status(404).json({ error: `Route ${req.method} ${req.originalUrl} not found.` });
};
