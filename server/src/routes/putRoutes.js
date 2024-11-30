import express from "express";
import {
  handleCreateStore,
  handleUpdateStore,
} from "../services/admin/useStore.js";
import {
  handlePutAssignment,
  handlePutRemoveInQueue,
  handleRemoveUnit,
  handleUpdateEditUnit,
  handleUpdateGenerateQueueNumber,
  handleUpdateProgressInqueueAndAtStore,
} from "../services/admin/useUnits.js";
import { getPool } from "../db/dbConfig.js";
import {
  handleDeleteServiceType,
  handleUpdateServiceType,
} from "../services/admin/useSettings.js";
import {
  handleUpdateAdminBasedUser,
  handleUpdatePermissions,
  handleUpdateRemoveUser,
} from "../services/admin/useUser.js";
import {
  handleRemoveItem,
  handleUpdateCategoryName,
  handleUpdateItem,
  handleUpdateRemoveCategory,
  handleUpdateStock,
} from "../services/admin/useInventory.js";
import { handleUpdateServiceRequestOngoing } from "../services/user/staff.js";
import { handleUpdateReview } from "../services/admin/useReviews.js";
import {
  handleUpdateActivatedPromo,
  handleUpdateDeactivatePromo,
  handleUpdatePromo,
  handleUpdateServiceDelete,
} from "../services/admin/useServices.js";
import {
  handleUpdateServiceRequestAtStoreToInQueue,
  handleUpdateServiceRequestCompletedPickup,
} from "../services/admin/useSchedule.js";

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
  "/update-status",
  withDatabaseConnection(async (req, res, connection) => {
    await handleUpdateUserStatus(req, res, connection);
  })
);

// UNIT MONITORED SECTION
router.put(
  "/monitored-unit/:id/update-edit-unit",
  withDatabaseConnection(async (req, res, connection) => {
    try {
      await handleUpdateEditUnit(req, res, connection);
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  })
);

router.put(
  "/monitored-unit/:id/remove-laundry-unit",
  withDatabaseConnection(async (req, res, connection) => {
    try {
      await handleRemoveUnit(req, res, connection);
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  })
);

router.put(
  "/user/:id/update-assignment",
  withDatabaseConnection(async (req, res, connection) => {
    await handlePutAssignment(req, res, connection);
  })
);
router.put(
  "/user/:id/remove-request",
  withDatabaseConnection(async (req, res, connection) => {
    await handlePutRemoveInQueue(req, res, connection);
  })
);

router.put(
  "/monitored-unit/:id/update-progress-inqueue-store",
  withDatabaseConnection(async (req, res, connection) => {
    try {
      await handleUpdateProgressInqueueAndAtStore(req, res, connection);
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  })
);

router.put(
  "/monitored-unit/:id/update-inqueue-generate-number",
  withDatabaseConnection(async (req, res, connection) => {
    try {
      await handleUpdateGenerateQueueNumber(req, res, connection);
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  })
);

//#VIEW SCHEDULES SECTION
router.put(
  "/schedules/:id/update-pending-assign",
  withDatabaseConnection(async (req, res, connection) => {
    try {
      await handleUpdateServiceRequestOngoing(req, res, connection);
    } catch (error) {
      console.error("Error retrieving service request:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  })
);

router.put(
  "/schedules/:id/update-completed-pickup-at-store",
  withDatabaseConnection(async (req, res, connection) => {
    try {
      await handleUpdateServiceRequestCompletedPickup(req, res, connection);
    } catch (error) {
      console.error("Error retrieving service request:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  })
);

router.put(
  "/schedules/:id/update-at-store-in-queue",
  withDatabaseConnection(async (req, res, connection) => {
    try {
      await handleUpdateServiceRequestAtStoreToInQueue(req, res, connection);
    } catch (error) {
      console.error("Error retrieving service request:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  })
);

//#INVENTORY SECTION
router.put(
  "/inventory/:id/update-category-name",
  withDatabaseConnection(async (req, res, connection) => {
    try {
      await handleUpdateCategoryName(req, res, connection);
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  })
);

router.put(
  "/inventory/:id/update-remove-category",
  withDatabaseConnection(async (req, res, connection) => {
    try {
      await handleUpdateRemoveCategory(req, res, connection);
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  })
);

router.put(
  "/inventory/:id/update-stock",
  withDatabaseConnection(async (req, res, connection) => {
    try {
      await handleUpdateStock(req, res, connection);
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  })
);

router.put(
  "/inventory/:id/update-edit-item",
  withDatabaseConnection(async (req, res, connection) => {
    try {
      await handleUpdateItem(req, res, connection);
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  })
);

router.put(
  "/inventory/:id/update-remove-item",
  withDatabaseConnection(async (req, res, connection) => {
    try {
      await handleRemoveItem(req, res, connection);
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  })
);

//#STORE MANAGEMENT SECTION
router.put(
  "/stores/:id/update-store",
  withDatabaseConnection(async (req, res, connection) => {
    try {
      await handleUpdateStore(req, res, connection);
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  })
);

//#USER MANAGEMENT SECTION
// #For role and permisson
router.put(
  "/usermanage/:id/update-permissions",
  withDatabaseConnection(async (req, res, connection) => {
    try {
      await handleUpdatePermissions(req, res, connection);
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  })
);

// #For user
router.put(
  "/usermanage/:id/update-admin-based-user",
  withDatabaseConnection(async (req, res, connection) => {
    try {
      await handleUpdateAdminBasedUser(req, res, connection);
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  })
);

router.put(
  "/usermanage/:id/update-manager-based-user",
  withDatabaseConnection(async (req, res, connection) => {
    try {
      // await handleUpdateAdminBasedUser(req, res, connection);
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  })
);

router.put(
  "/usermanage/:id/update-remove-user",
  withDatabaseConnection(async (req, res, connection) => {
    try {
      await handleUpdateRemoveUser(req, res, connection);
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  })
);

//#FEEDBACK AND REVIEWS SECTION
router.put(
  "/reviews/:id/update-reviews",
  withDatabaseConnection(async (req, res, connection) => {
    try {
      await handleUpdateReview(req, res, connection);
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  })
);

//#SERVICES MANAGEMENT SECTION
router.put(
  "/services-management/:id/update-service-promo",
  withDatabaseConnection(async (req, res, connection) => {
    try {
      await handleUpdatePromo(req, res, connection);
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  })
);

router.put(
  "/services-management/:id/update-promo-deactivated",
  withDatabaseConnection(async (req, res, connection) => {
    try {
      await handleUpdateDeactivatePromo(req, res, connection);
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  })
);

router.put(
  "/services-management/:id/update-promo-activated",
  withDatabaseConnection(async (req, res, connection) => {
    try {
      await handleUpdateActivatedPromo(req, res, connection);
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  })
);

router.put(
  "/services-management/:id/update-service-delete",
  withDatabaseConnection(async (req, res, connection) => {
    try {
      await handleUpdateServiceDelete(req, res, connection);
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  })
);

// SETTINGS SECTION
// #For tab dashboard config
// #For tab services type
router.put(
  "/settings/:id/update-service-types",
  withDatabaseConnection(async (req, res, connection) => {
    try {
      await handleUpdateServiceType(req, res, connection);
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  })
);

router.put(
  "/settings/:id/delete-service-types",
  withDatabaseConnection(async (req, res, connection) => {
    try {
      await handleDeleteServiceType(req, res, connection);
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  })
);

export default router;
