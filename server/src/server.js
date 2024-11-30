import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import http from "http"; // Import http to create an HTTP server

// Import routes
import authRoutes from "./routes/authRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import getRoutes from "./routes/getRoutes.js";
import putRoutes from "./routes/putRoutes.js";
import checkRoutes from "./routes/checkRoutes.js";
import mobileRoutes from "./routes/mobile/mobileRoutes.js";
import customerRoutes from "./routes/customerRoutes.js";

// Import File Function
import {
  ensureMainStoreExists,
  createDefaultAdmin,
} from "./services/default.js";

// Database Connection
import { getPool } from "./db/dbConfig.js";

import { setupSocketIO } from "./socket/socket.js";

const app = express();
const port = process.env.PORT || 3002;

const allowedOrigins = [
  process.env.NODE_ENV === "production"
    ? process.env.PRODUCTION_FRONTEND_URL
    : process.env.DEVELOPMENT_FRONTEND_URL,
];

app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: (origin, callback) => {
      console.log("Request origin:", origin);
      if (process.env.NODE_ENV === "production") {
        if (allowedOrigins.includes(origin) || !origin) {
          callback(null, true);
        } else {
          console.error(`CORS blocked request from origin: ${origin}`);
          callback(new Error("Not allowed by CORS"));
        }
      } else {
        callback(null, true); // Allow all origins in development
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true, // Allow cookies to be sent
  })
);

app.use(
  "/api",
  authRoutes,
  postRoutes,
  getRoutes,
  putRoutes,
  checkRoutes,
  customerRoutes,
  mobileRoutes
);

const server = http.createServer(app);
setupSocketIO(server);

// Ensure main store exists and start the server
const initServer = async () => {
  try {
    const pool = await getPool();
    const connection = await pool.getConnection();
    try {
      await ensureMainStoreExists(connection);
      await createDefaultAdmin(connection);

      server.listen(port, () => {
        console.log(`Server is running on port ${port}`);
      });
    } finally {
      connection.release();
    }
  } catch (err) {
    console.error("Failed to initialize server:", err);
    process.exit(1);
  }
};

initServer();
