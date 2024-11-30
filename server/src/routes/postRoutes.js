import express from "express";
import { handleCreateStore } from "../services/admin/useStore.js";
import {
  handleCreateUnits,
  handleSetCustomerInQueue,
  handleSetLaundryAssignment,
  handleSetWalkInRequest,
  handleTypeOnlineTransaction,
  handleTypeWalkInTransaction,
} from "../services/admin/useUnits.js";
import {
  handleCreateItemCategory,
  handleCreateNewItem,
  handleCreateReuseItem,
} from "../services/admin/useInventory.js";
import {
  handleCustomerServiceRequest,
  handleRegisterCustomerModule,
} from "../services/admin/useCustomer.js";
import { getPool } from "../db/dbConfig.js";
import { handleSetNewServiceType } from "../services/admin/useSettings.js";
import {
  handleAdminBasedSetNewUser,
  handleSetRolesPermissions,
} from "../services/admin/useUser.js";
import { handleSetServicesPromo } from "../services/admin/useServices.js";
import { handleSetNewMessages } from "../services/useMessages.js";

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

//#UNIT MONITORED SECTION

router.post(
  "/monitored-unit/:id/set-customer-inqueue",
  withDatabaseConnection(async (req, res, connection) => {
    try {
      await handleSetCustomerInQueue(req, res, connection);
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  })
);

router.post(
  "/monitored-unit/set-new-transaction-online",
  withDatabaseConnection(async (req, res, connection) => {
    try {
      await handleTypeOnlineTransaction(req, res, connection);
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  })
);

router.post(
  "/monitored-unit/set-new-transaction-walkin",
  withDatabaseConnection(async (req, res, connection) => {
    try {
      await handleTypeWalkInTransaction(req, res, connection);
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  })
);

router.post(
  "/monitored-unit/create-unit",
  withDatabaseConnection(async (req, res, connection) => {
    await handleCreateUnits(req, res, connection);
  })
);

router.post(
  "/monitored-unit/set-new-assignment",
  withDatabaseConnection(async (req, res, connection) => {
    try {
      await handleSetLaundryAssignment(req, res, connection);
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  })
);

router.post(
  "/unit-monitor/:id/set-walkin",
  withDatabaseConnection(async (req, res, connection) => {
    await handleSetWalkInRequest(req, res, connection);
  })
);

router.post(
  "/unit-monitor/:id/set-completed",
  withDatabaseConnection(async (req, res, connection) => {})
);

// #Store Section
router.post(
  "/stores/set-new-stores",
  withDatabaseConnection(async (req, res, connection) => {
    try {
      await handleCreateStore(req, res, connection);
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  })
);

//#INVENTORY SECTION
router.post(
  "/inventory/create-new-item",
  withDatabaseConnection(async (req, res, connection) => {
    try {
      await handleCreateNewItem(req, res, connection);
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  })
);

router.post(
  "/inventory/create-category-item",
  withDatabaseConnection(async (req, res, connection) => {
    try {
      await handleCreateItemCategory(req, res, connection);
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  })
);

router.post(
  "/inventory/create-reuse-item",
  withDatabaseConnection(async (req, res, connection) => {
    try {
      await handleCreateReuseItem(req, res, connection);
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  })
);

// #USER MANAGEMENT SECTION
// #For role and permissions
router.post(
  "/usermanage/:id/set-role-permisions",
  withDatabaseConnection(async (req, res, connection) => {
    try {
      await handleSetRolesPermissions(req, res, connection);
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  })
);

// #For add user
router.post(
  "/usermanage/set-new-user",
  withDatabaseConnection(async (req, res, connection) => {
    try {
      await handleAdminBasedSetNewUser(req, res, connection);
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  })
);

//#VIEW CUSTOMER SECTION
router.post(
  "/customer-management/set-new-customer-account",
  withDatabaseConnection(async (req, res, connection) => {
    try {
      await handleRegisterCustomerModule(req, res, connection);
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  })
);

// #INBOX SECTION ADMIN AND MANAGER
router.post(
  "/inbox/set-new-messsages-admin",
  withDatabaseConnection(async (req, res, connection) => {
    try {
      await handleSetNewMessages(req, res, connection);
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  })
);

//#SERVICES MANAGEMENT SECTION
router.post(
  "/services-management/set-new-promo-service",
  withDatabaseConnection(async (req, res, connection) => {
    try {
      await handleSetServicesPromo(req, res, connection);
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  })
);

// SETTINGS SECTION
// -> TAB DASHBOARD CONFIG <-
router.post(
  "/settings/set-dashboard-config",
  withDatabaseConnection(async (req, res, connection) => {})
);

// -> TAB SERVICE TYPES <-
router.post(
  "/settings/set-service-types",
  withDatabaseConnection(async (req, res, connection) => {
    await handleSetNewServiceType(req, res, connection);
  })
);

// Customers Side
router.post(
  "/customers/:id/service-requests",
  withDatabaseConnection(async (req, res, connection) => {
    await handleCustomerServiceRequest(req, res, connection);
  })
);

export default router;
