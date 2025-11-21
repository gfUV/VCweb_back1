/**
 * @file index.ts
 * @description Entry point of the backend server.
 *
 * Initializes the Express application, configures middlewares,
 * registers centralized routes, and starts the HTTP server.
 */

import express, { Application, Request, Response, NextFunction } from "express";
import cors from "cors";
import dotenv from "dotenv";
import Routes from "./routes/routes"; // <--- CENTRAL ROUTER

// Load environment variables
dotenv.config();

// Initialize Express app
const app: Application = express();

/* ------------------------------------------------------------
 *  MIDDLEWARE CONFIGURATION
 * ------------------------------------------------------------ */

/** Parse JSON request bodies */
app.use(express.json());

/** Enable Cross-Origin Resource Sharing */
app.use(cors());

/* ------------------------------------------------------------
 *  ROUTE REGISTRATION
 * ------------------------------------------------------------ */

/**
 * @route /
 * @description Health check endpoint
 */
app.get("/", (_req: Request, res: Response) => {
  res.status(200).json({
    message: "API is running successfully",
    timestamp: new Date().toISOString(),
  });
});

/**
 * Register all API routes
 *
 * The central routes file automatically mounts:
 *  - /users
 *  - /auth
 */
app.use("/", Routes);

/* ------------------------------------------------------------
 *  GLOBAL ERROR HANDLER
 * ------------------------------------------------------------ */

app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error("🔥 Global Error Handler:", err);

  res.status(err.status || 500).json({
    error: true,
    message: err.message || "Internal server error",
  });
});

/* ------------------------------------------------------------
 *  SERVER INITIALIZATION
 * ------------------------------------------------------------ */

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
