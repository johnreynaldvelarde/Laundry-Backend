import express from "express";
import { getPool } from "../src/db/dbConfig.js";
import { handleGetLaundryPickup } from "../src/services/user/staff.js";

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

// GET
router.get(
  "/staff/:id/get-laundry-pickup",
  withDatabaseConnection(async (req, res, connection) => {
    try {
      await handleGetLaundryPickup(req, res, connection);
    } catch (error) {
      console.error("Error retrieving service request:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  })
);

export default router;

// Update User Status to offline isStatus to 0
// router.post('/update-status', withDatabaseConnection(async (req, res, connection) => {
//     await handleUpdateUserStatus(req, res, connection);
// }));

// router.put('/customers/:id/start', withDatabaseConnection(async (req, res, connection) => {
//   await handleUpdateCustomerBasicInformation(req, res, connection);
// }));

// router.put('/user/:id/update-assignment', withDatabaseConnection(async (req, res, connection) => {
//   await handlePutAssignment(req, res, connection);
// }));

// router.put('/update-start-customer', withDatabaseConnection(async (req, res, connection) => {
//   await handleUpdateCustomerBasicInformation(req, res, connection);
// }));
