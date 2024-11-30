import express from "express";
import {
  handleGetDelivery,
  handleGetLaundryPickup,
  handleGetNotificationStaff,
  handleSetMessagesSenderIsStaff,
  handleUpdateServiceRequestBackToPending,
  handleUpdateServiceRequestFinishPickup,
  handleUpdateServiceRequestFinishTheDelivery,
  handleUpdateServiceRequestReadyDeliveryToOngoing,
  handleUpdateServiceRequestUsingQrCode,
} from "../../services/user/staff.js";
import { getPool } from "../../db/dbConfig.js";
import {
  handleUpdateServiceRequestCancel,
  handleUpdateServiceRequestOngoing,
} from "../../services/user/staff.js";
import {
  getUserMobileDetails,
  handleCheckCustomerDetailsMobile,
  handleLoginMobile,
  handleRegisterCustomer,
} from "../../services/authentication.js";
import {
  handleGetNotificationCustomer,
  handleGetStoreList,
  handleUpdateAccountVerified,
  handleUpdateCustomerBasicInformationMobile,
  handleUpdateEmailForVerification,
} from "../../services/user/customer.js";
import {
  handleGetInbox,
  handleGetMessages,
  handleSetNewMessages,
  handleUpdateMessageIsRead,
} from "../../services/useMessages.js";

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

// ALL AROUND API
router.post(
  "/mobile-customer-staff/set-new-messsages",
  withDatabaseConnection(async (req, res, connection) => {
    try {
      await handleSetNewMessages(req, res, connection);
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  })
);

router.get(
  "/mobile-customer-staff/:user_one_id/:user_two_id/get-messages",
  withDatabaseConnection(async (req, res, connection) => {
    try {
      await handleGetMessages(req, res, connection);
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  })
);

router.get(
  "/mobile-customer-staff/:id/get-inbox",
  withDatabaseConnection(async (req, res, connection) => {
    try {
      await handleGetInbox(req, res, connection);
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  })
);

router.put(
  "/mobile-customer-staff/:user_one_id/:user_two_id/put-update-message",
  withDatabaseConnection(async (req, res, connection) => {
    try {
      await handleUpdateMessageIsRead(req, res, connection);
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  })
);

// NOTIFICATION
router.get(
  "/mobile-customer-staff/:id/get-notification-customer",
  withDatabaseConnection(async (req, res, connection) => {
    try {
      await handleGetNotificationCustomer(req, res, connection);
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  })
);

router.get(
  "/mobile-customer-staff/:id/get-notification-staff",
  withDatabaseConnection(async (req, res, connection) => {
    try {
      await handleGetNotificationStaff(req, res, connection);
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  })
);

// CUSTOMER SECTION
// #POST
router.post(
  "/login-mobile",
  withDatabaseConnection(async (req, res, connection) => {
    try {
      await handleLoginMobile(req, res, connection);
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  })
);

router.post(
  "/register-mobile",
  withDatabaseConnection(async (req, res, connection) => {
    try {
      await handleRegisterCustomer(req, res, connection);
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  })
);

//#GET
router.get(
  "/customers/get-store-list",
  withDatabaseConnection(async (req, res, connection) => {
    try {
      await handleGetStoreList(req, res, connection);
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  })
);

router.get(
  "/customers/:id/check-customer-details",
  withDatabaseConnection(async (req, res, connection) => {
    try {
      await handleCheckCustomerDetailsMobile(req, res, connection);
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  })
);

router.get(
  "/mobile-users/me",
  withDatabaseConnection(async (req, res, connection) => {
    try {
      await getUserMobileDetails(req, res, connection);
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  })
);

// #PUT
router.put(
  "/customers/:id/update-customer-details",
  withDatabaseConnection(async (req, res, connection) => {
    try {
      await handleUpdateCustomerBasicInformationMobile(req, res, connection);
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  })
);

router.put(
  "/customers/:id/update-email-for-verified",
  withDatabaseConnection(async (req, res, connection) => {
    try {
      await handleUpdateEmailForVerification(req, res, connection);
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  })
);

router.put(
  "/customers/:id/update-account-verified",
  withDatabaseConnection(async (req, res, connection) => {
    try {
      await handleUpdateAccountVerified(req, res, connection);
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  })
);

// ---STAFF SECTION---
// #POST
router.post(
  "/staff/set-messages-sender-staff",
  withDatabaseConnection(async (req, res, connection) => {
    try {
      await handleSetMessagesSenderIsStaff(req, res, connection);
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  })
);

// #GET
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

router.get(
  "/staff/:id/get-laundry-delivery",
  withDatabaseConnection(async (req, res, connection) => {
    try {
      await handleGetDelivery(req, res, connection);
    } catch (error) {
      console.error("Error retrieving service request:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  })
);

// #GET STAFF MESSAGE
router.get(
  "/staff/:id/get-staff-convo",
  withDatabaseConnection(async (req, res, connection) => {
    try {
      await handleGetMessages(req, res, connection);
    } catch (error) {
      console.error("Error retrieving staff message request:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  })
);

//#PENDING TO CANCEL
router.put(
  "/staff/:id/update-request-cancel",
  withDatabaseConnection(async (req, res, connection) => {
    try {
      await handleUpdateServiceRequestCancel(req, res, connection);
    } catch (error) {
      console.error("Error retrieving service request:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  })
);

//# PENDING TO ONGOING
router.put(
  "/staff/:id/update-request-ongoing",
  withDatabaseConnection(async (req, res, connection) => {
    try {
      await handleUpdateServiceRequestOngoing(req, res, connection);
    } catch (error) {
      console.error("Error retrieving service request:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  })
);

//# ONGOING TO PENDING
router.put(
  "/staff/:id/update-request-back-pending",
  withDatabaseConnection(async (req, res, connection) => {
    try {
      await handleUpdateServiceRequestBackToPending(req, res, connection);
    } catch (error) {
      console.error("Error retrieving service request:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  })
);

//# ONGOING TO COMPLETED
router.put(
  "/staff/:id/update-request-finish-pickup",
  withDatabaseConnection(async (req, res, connection) => {
    try {
      await handleUpdateServiceRequestFinishPickup(req, res, connection);
    } catch (error) {
      console.error("Error retrieving service request:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  })
);

//# DELIVERY SECTION
router.put(
  "/staff/:id/update-request-finish-delivery",
  withDatabaseConnection(async (req, res, connection) => {
    try {
      await handleUpdateServiceRequestFinishTheDelivery(req, res, connection);
    } catch (error) {
      console.error("Error retrieving service request:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  })
);

router.put(
  "/staff/:id/update-request-proceed-delivery",
  withDatabaseConnection(async (req, res, connection) => {
    try {
      await handleUpdateServiceRequestReadyDeliveryToOngoing(
        req,
        res,
        connection
      );
    } catch (error) {
      console.error("Error retrieving service request:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  })
);

//# SCAN QR CODE FOR PICKUP
router.put(
  "/staff/:id/update-request-qr-code",
  withDatabaseConnection(async (req, res, connection) => {
    try {
      await handleUpdateServiceRequestUsingQrCode(req, res, connection);
    } catch (error) {
      console.error("Error retrieving service request:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  })
);

export default router;
