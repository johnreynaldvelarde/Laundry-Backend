import express from "express";
import { handleCheckUsername } from "../services/useCheck.js";
import { getPool } from "../db/dbConfig.js";

const router = express.Router();

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

router.post(
  "/check-username",
  withDatabaseConnection(async (req, res, connection) => {
    try {
      await handleCheckUsername(req, res, connection);
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  })
);

export default router;
