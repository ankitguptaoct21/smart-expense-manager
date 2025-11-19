import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";

import apiRoutes from "./routes/index.js";
import appConfig from "./config/index.js";

// Initialising express
const app = express();

// Initialising global middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(helmet());

// Initialising logs
appConfig.node_env === "development" ? app.use(morgan("dev")) : app.use(morgan("combined"));

// Mounting routes
app.use("/api", apiRoutes());

export default app;
