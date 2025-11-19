import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";
import dotenv from "dotenv";

import apiRoutes from "./routes/index.js";

// Initialising .env
dotenv.config();

// Initialising express
const app = express();

// Initialising global middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(helmet());

// Initialising logs
process.env.NODE_ENV === "development" ? app.use(morgan("dev")) : app.use(morgan("combined"));

// Mounting routes
app.use("/api", apiRoutes());

export default app;
