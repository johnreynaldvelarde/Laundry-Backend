import express from "express";
import {
  handleViewStore,
  handleViewStoreByAdmin,
} from "../services/admin/useStore.js";
import {
  handleGetCalculatedTransaction,
  handleGetCountLaundryAssignment,
  handleGetCountRequestInQueue,
  handleGetInventoryLaundryItem,
  handleGetLaundryAssignments,
  handleGetSelectedCustomer,
  handleGetServiceInQueue,
  handleGetServiceType,
  handleGetUnitListAvaiable,
  handleViewUnits,
} from "../services/admin/useUnits.js";
import { handleGenerateUnitName } from "../services/checkService.js";
import {
  handleGetCategory,
  handleGetItemListToReuse,
  handleViewInventory,
  handleViewListCategory,
} from "../services/admin/useInventory.js";
import { getPool } from "../db/dbConfig.js";
import {
  handleGetBasedListUser,
  handleGetBasedUser,
  handleGetRolesPermissions,
  handleGetStoresBasedAdmin,
} from "../services/admin/useUser.js";
import { handleGetServiceTypeAndStore } from "../services/admin/useSettings.js";
import {
  handleGetInboxAdmin,
  handleGetMessagesOnlyWeb,
} from "../services/useMessages.js";
import {
  handleGetScheduleServiceRequest,
  handleGetScheduleStatsByUser,
  handleGetSelectedStaff,
} from "../services/admin/useSchedule.js";
import { handleGetReviewsList } from "../services/admin/useReviews.js";
import {
  handleGetActivityLog,
  handleGetActivityLogStats,
} from "../services/admin/useActivityLog.js";
import {
  handleGetCustomerTypeStats,
  handleGetTotalSalesByMonth,
  handleGetTransactionHistory,
} from "../services/admin/useTransaction.js";
import {
  handleGetCustomerGrowthOverTime,
  handleGetCustomerList,
} from "../services/admin/useCustomer.js";
import {
  handleGetServicePromoList,
  handleGetServiceTypeList,
} from "../services/admin/useServices.js";
import {
  handleAdminGetListCustomerMostServiceRequest,
  handleAdminGetListTopMostUseService,
  handleAdminGetMapCustomerAndStore,
  handleAdminGetRevenueByMonth,
  handleAdminGetTotalCustomers,
  handleAdminGetTotalCustomersWithStoreId,
  handleAdminGetTotalLaundryLoadProcess,
  handleAdminGetTotalLaundryOrders,
  handleAdminGetTotalLaundryOrdersWithStoreId,
  handleAdminGetTotalRevenue,
  handleAdminGetTotalRevenueWithStoreId,
  handleUserGetListReadyForDelivery,
} from "../services/admin/useDashboard.js";
import { handleGetNotificationUser } from "../services/admin/useNotifications.js";

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
// ALL AROUND
router.get(
  "/navbar/:id/get-notifications-user",
  withDatabaseConnection(async (req, res, connection) => {
    try {
      await handleGetNotificationUser(req, res, connection);
    } catch (error) {
      console.error("Error handling user notifications:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  })
);

// #DASHBOARD ADMIN
router.get(
  "/dashboard/get-total-revenue",
  withDatabaseConnection(async (req, res, connection) => {
    try {
      await handleAdminGetTotalRevenue(req, res, connection);
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  })
);

router.get(
  "/dashboard/get-total-laundry-orders",
  withDatabaseConnection(async (req, res, connection) => {
    try {
      await handleAdminGetTotalLaundryOrders(req, res, connection);
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  })
);

router.get(
  "/dashboard/get-total-customers",
  withDatabaseConnection(async (req, res, connection) => {
    try {
      await handleAdminGetTotalCustomers(req, res, connection);
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  })
);

router.get(
  "/dashboard/get-total-laundry-load",
  withDatabaseConnection(async (req, res, connection) => {
    try {
      await handleAdminGetTotalLaundryLoadProcess(req, res, connection);
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  })
);

router.get(
  "/dashboard/get-total-customer-most-request",
  withDatabaseConnection(async (req, res, connection) => {
    try {
      await handleAdminGetListCustomerMostServiceRequest(req, res, connection);
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  })
);

router.get(
  "/dashboard/get-revenue-growth-month",
  withDatabaseConnection(async (req, res, connection) => {
    try {
      await handleAdminGetRevenueByMonth(req, res, connection);
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  })
);

// WITH STORE ID
router.get(
  "/dashboard/:id/get-total-revenue",
  withDatabaseConnection(async (req, res, connection) => {
    try {
      await handleAdminGetTotalRevenueWithStoreId(req, res, connection);
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  })
);

router.get(
  "/dashboard/:id/get-total-laundry-orders",
  withDatabaseConnection(async (req, res, connection) => {
    try {
      await handleAdminGetTotalLaundryOrdersWithStoreId(req, res, connection);
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  })
);

router.get(
  "/dashboard/:id/get-total-customers",
  withDatabaseConnection(async (req, res, connection) => {
    try {
      await handleAdminGetTotalCustomersWithStoreId(req, res, connection);
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  })
);

router.get(
  "/dashboard/:id/get-total-laundry-load",
  withDatabaseConnection(async (req, res, connection) => {
    try {
      await handleAdminGetTotalLaundryLoadProcess(req, res, connection);
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  })
);

// WITH STORE ID ITS TABLE
router.get(
  "/dashboard/:id/get-list-ready-for-delivery",
  withDatabaseConnection(async (req, res, connection) => {
    try {
      await handleUserGetListReadyForDelivery(req, res, connection);
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  })
);

// LOCATION MAP AND CUSTOMER
router.get(
  "/dashboard/get-store-customer-location",
  withDatabaseConnection(async (req, res, connection) => {
    try {
      await handleAdminGetMapCustomerAndStore(req, res, connection);
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  })
);

// TOP MOST USE SERVICE
router.get(
  "/dashboard/get-most-use-service",
  withDatabaseConnection(async (req, res, connection) => {
    try {
      await handleAdminGetListTopMostUseService(req, res, connection);
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  })
);

// #STORE SECTION
router.get(
  "/view-store",
  withDatabaseConnection(async (req, res, connection) => {
    await handleViewStore(req, res, connection);
  })
);

// UNIT MONITORED SECTION
router.get(
  "/monitored-unit/:id/get-calculated-transaction",
  withDatabaseConnection(async (req, res, connection) => {
    try {
      await handleGetCalculatedTransaction(req, res, connection);
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  })
);

router.get(
  "/monitored-unit/:id/get-laundry-item",
  withDatabaseConnection(async (req, res, connection) => {
    try {
      await handleGetInventoryLaundryItem(req, res, connection);
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  })
);

router.get(
  "/monitored-unit/:id/count-inqueue",
  withDatabaseConnection(async (req, res, connection) => {
    await handleGetCountRequestInQueue(req, res, connection);
  })
);

router.get(
  "/monitored-unit/:id/count-assignment",
  withDatabaseConnection(async (req, res, connection) => {
    await handleGetCountLaundryAssignment(req, res, connection);
  })
);

router.get(
  "/monitored-unit/:id/get-customer",
  withDatabaseConnection(async (req, res, connection) => {
    await handleGetSelectedCustomer(req, res, connection);
  })
);

router.get(
  "/monitored-unit/:id/get-assignment",
  withDatabaseConnection(async (req, res, connection) => {
    await handleGetLaundryAssignments(req, res, connection);
  })
);

router.get(
  "/monitored-unit/:id/unit-available",
  withDatabaseConnection(async (req, res, connection) => {
    await handleGetUnitListAvaiable(req, res, connection);
  })
);

router.get(
  "/view-units",
  withDatabaseConnection(async (req, res, connection) => {
    await handleViewUnits(req, res, connection);
  })
);

router.get(
  "/get-unitname",
  withDatabaseConnection(async (req, res, connection) => {
    await handleGenerateUnitName(req, res, connection);
  })
);

router.get(
  "/unit/:id/get-service-types",
  withDatabaseConnection(async (req, res, connection) => {
    await handleGetServiceType(req, res, connection);
  })
);

router.get(
  "/monitored-unit/:id/get-inqueue",
  withDatabaseConnection(async (req, res, connection) => {
    await handleGetServiceInQueue(req, res, connection);
  })
);

// VIEW SCHEDULE SECTION
router.get(
  "/schedules/admin-get-stores",
  withDatabaseConnection(async (req, res, connection) => {
    try {
      await handleViewStoreByAdmin(req, res, connection);
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  })
);

router.get(
  "/schedules/:id/user-get-schedules-stats",
  withDatabaseConnection(async (req, res, connection) => {
    try {
      await handleGetScheduleStatsByUser(req, res, connection);
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  })
);

router.get(
  "/schedules/:id/user-get-schedules",
  withDatabaseConnection(async (req, res, connection) => {
    try {
      await handleGetScheduleServiceRequest(req, res, connection);
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  })
);

router.get(
  "/schedules/:id/get-assign-staff",
  withDatabaseConnection(async (req, res, connection) => {
    try {
      await handleGetSelectedStaff(req, res, connection);
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  })
);

// #STORE MANAGEMENT SECTION
router.get(
  "/stores/admin-get-stores",
  withDatabaseConnection(async (req, res, connection) => {
    try {
      await handleViewStoreByAdmin(req, res, connection);
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  })
);

// #INVENTORY SECTION
router.get(
  "/get-category",
  withDatabaseConnection(async (req, res, connection) => {
    await handleGetCategory(req, res, connection);
  })
);

router.get(
  "/inventory/view-inventory/",
  withDatabaseConnection(async (req, res, connection) => {
    try {
      await handleViewInventory(req, res, connection);
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  })
);

router.get(
  "/inventory/:id/view-item-reuse/",
  withDatabaseConnection(async (req, res, connection) => {
    try {
      await handleGetItemListToReuse(req, res, connection);
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  })
);

router.get(
  "/view-category",
  withDatabaseConnection(async (req, res, connection) => {
    try {
      await handleViewListCategory(req, res, connection);
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  })
);

// #USER MANAGEMENT SECTION
router.get(
  "/user/:id/admin-get-user",
  withDatabaseConnection(async (req, res, connection) => {
    await handleAdminGetUser(req, res, connection);
  })
);

// For role and permission
router.get(
  "/usermanage/:id/admin-get-role-permissions",
  withDatabaseConnection(async (req, res, connection) => {
    try {
      await handleGetRolesPermissions(req, res, connection);
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  })
);

// For stores and user
router.get(
  "/usermanage/:id/admin-get-store",
  withDatabaseConnection(async (req, res, connection) => {
    try {
      await handleGetStoresBasedAdmin(req, res, connection);
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  })
);

router.get(
  "/usermanage/:id/admin-get-user",
  withDatabaseConnection(async (req, res, connection) => {
    try {
      await handleGetBasedUser(req, res, connection);
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  })
);

router.get(
  "/usermanage/:id/get-user-list",
  withDatabaseConnection(async (req, res, connection) => {
    try {
      await handleGetBasedListUser(req, res, connection);
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  })
);

// #CUSTOMER MANAGEMENT SECTION
router.get(
  "/customer-management/:id/get-customer-list",
  withDatabaseConnection(async (req, res, connection) => {
    try {
      await handleGetCustomerList(req, res, connection);
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  })
);

router.get(
  "/customer-management/:id/get-customer-growth-overtime",
  withDatabaseConnection(async (req, res, connection) => {
    try {
      await handleGetCustomerGrowthOverTime(req, res, connection);
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  })
);

// #INBOX SECTION ADMIN AND MANAGER
// router.get(
//   "/inbox/:id/get-inbox",
//   withDatabaseConnection(async (req, res, connection) => {
//     try {
//       await handleGetInboxOnlyAdmin(req, res, connection);
//     } catch (error) {
//       res.status(500).json({ error: "Internal Server Error" });
//     }
//   })
// );

router.get(
  "/inbox/:id/get-inbox-admin",
  withDatabaseConnection(async (req, res, connection) => {
    try {
      await handleGetInboxAdmin(req, res, connection);
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  })
);

router.get(
  "/inbox/:id/get-messages",
  withDatabaseConnection(async (req, res, connection) => {
    try {
      await handleGetMessagesOnlyWeb(req, res, connection);
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  })
);

// #REVIEWS SECTION
router.get(
  "/reviews/:id/get-reviews",
  withDatabaseConnection(async (req, res, connection) => {
    try {
      await handleGetReviewsList(req, res, connection);
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  })
);

// #SERVICES MANAGEMENT SECTION
router.get(
  "/services-management/:id/get-services-type-list",
  withDatabaseConnection(async (req, res, connection) => {
    try {
      await handleGetServiceTypeList(req, res, connection);
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  })
);

router.get(
  "/services-management/:id/get-services-promo-list",
  withDatabaseConnection(async (req, res, connection) => {
    try {
      await handleGetServicePromoList(req, res, connection);
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  })
);

// #TRANSACTION HISTORY SECTION
router.get(
  "/transaction-history/:id/get-transaction-history",
  withDatabaseConnection(async (req, res, connection) => {
    try {
      await handleGetTransactionHistory(req, res, connection);
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  })
);

router.get(
  "/transaction-history/:id/get-transaction-sales-by-month",
  withDatabaseConnection(async (req, res, connection) => {
    try {
      await handleGetTotalSalesByMonth(req, res, connection);
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  })
);

router.get(
  "/transaction-history/:id/get-customer-types-stats",
  withDatabaseConnection(async (req, res, connection) => {
    try {
      await handleGetCustomerTypeStats(req, res, connection);
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  })
);

// #ACTIVITY LOG SECTION
router.get(
  "/activity-logs/get-activity-log",
  withDatabaseConnection(async (req, res, connection) => {
    try {
      await handleGetActivityLog(req, res, connection);
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  })
);

router.get(
  "/activity-logs/get-activity-log-stats",
  withDatabaseConnection(async (req, res, connection) => {
    try {
      await handleGetActivityLogStats(req, res, connection);
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  })
);

// SETTINGS SECTION
// -> TAB SERVICE TYPES <-
router.get(
  "/settings/:id/get-service-types",
  withDatabaseConnection(async (req, res, connection) => {
    await handleGetServiceTypeAndStore(req, res, connection);
  })
);

export default router;
