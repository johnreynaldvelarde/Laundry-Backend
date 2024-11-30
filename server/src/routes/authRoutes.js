import express from "express";
import { getPool } from "../db/dbConfig.js";
import {
  handleLogin,
  getUserDetails,
  handleLogout,
} from "../services/authService.js";
import jwt from "jsonwebtoken";
import {
  handleCheckCustomerDetailsWeb,
  handleIsUserExists,
  handleRegisterCustomer,
} from "../services/authentication.js";

const router = express.Router();

// Middleware to manage database connection
const withDatabaseConnection = (handler) => async (req, res) => {
  const pool = await getPool();
  const connection = await pool.getConnection();
  try {
    await handler(req, res, connection);
  } catch (error) {
    console.error("Database operation error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  } finally {
    connection.release();
  }
};

// Login route
router.post(
  "/login",
  withDatabaseConnection(async (req, res, connection) => {
    try {
      await handleLogin(req, res, connection);
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  })
);

// Register route
router.post(
  "/register",
  withDatabaseConnection(async (req, res, connection) => {
    try {
      await handleRegisterCustomer(req, res, connection);
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  })
);

// Get user details route
router.get(
  "/user/me",
  withDatabaseConnection(async (req, res, connection) => {
    try {
      await getUserDetails(req, res, connection);
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  })
);

// Refresh token route
router.get("/refresh-token", (req, res) => {
  handleRefreshToken(req, res);
});

// for refresh token
function handleRefreshToken(req, res) {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    console.log("No refresh token provided");
    return res.json({ success: false, message: "No refresh token provided" });
  }

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) {
      console.log("Invalid refresh token:", err.message);
      return res
        .status(403)
        .json({ success: false, message: "Invalid refresh token" });
    }

    const accessToken = jwt.sign(
      { userId: user.userId, username: user.username, storeId: user.store_id },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" } // Adjust expiration as needed
    );

    res.json({ success: true, accessToken });
  });
}

// Logout route
router.post(
  "/logout",
  withDatabaseConnection(async (req, res, connection) => {
    try {
      await handleLogout(req, res, connection);
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  })
);

router.get(
  "/customers/:id/check-customer-details-web",
  withDatabaseConnection(async (req, res, connection) => {
    try {
      await handleCheckCustomerDetailsWeb(req, res, connection);
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  })
);

export default router;

// Forget Password and Email is Exist
router.post(
  "/is-email-exist",
  withDatabaseConnection(async (req, res, connection) => {
    try {
      await handleIsUserExists(req, res, connection);
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  })
);
