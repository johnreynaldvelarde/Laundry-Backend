import { axiosPrivate } from "./axios";

const handleError = (error) => {
  const message =
    error.response?.data?.message || "An unexpected error occurred.";
  return new Error(message);
};

// ALL AROUND
export const getListAdminUserNotifications = {
  getAdminUserNotifications: async (id) => {
    try {
      const response = await axiosPrivate.get(
        `/navbar/${id}/get-notifications-user`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

//#DASHBOARD ADMIN SECTION
export const getAdminTotalRevenue = {
  getTotalRevenue: async () => {
    try {
      const response = await axiosPrivate.get(`/dashboard/get-total-revenue`);
      return response.data;
    } catch (error) {
      console.error("Error fetching customer requests:", error);
      throw error;
    }
  },
};

export const getAdminTotalLaundryOrders = {
  getTotalLaundryOrders: async () => {
    try {
      const response = await axiosPrivate.get(
        `/dashboard/get-total-laundry-orders`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching customer requests:", error);
      throw error;
    }
  },
};

export const getAdminTotalCustomers = {
  getTotalCustomers: async () => {
    try {
      const response = await axiosPrivate.get(`/dashboard/get-total-customers`);
      return response.data;
    } catch (error) {
      console.error("Error fetching customer requests:", error);
      throw error;
    }
  },
};

export const getAdminTotalLaundryLoad = {
  getTotalLaundryLoad: async () => {
    try {
      const response = await axiosPrivate.get(
        `/dashboard/get-total-laundry-load`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching customer requests:", error);
      throw error;
    }
  },
};

export const getAdminListCustomerMostRequest = {
  getListCustomerMostRequest: async () => {
    try {
      const response = await axiosPrivate.get(
        `/dashboard/get-total-customer-most-request`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching customer requests:", error);
      throw error;
    }
  },
};

export const getAdminRevenueGrowthByMonth = {
  getRevenueMonth: async () => {
    try {
      const response = await axiosPrivate.get(
        `/dashboard/get-revenue-growth-month`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching customer requests:", error);
      throw error;
    }
  },
};

export const getAdminListReadyForDelivery = {
  getListNewCustomer: async () => {
    try {
      const response = await axiosPrivate.get(
        `/dashboard/get-list-ready-delivery`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching customer requests:", error);
      throw error;
    }
  },
};

export const getAdminListLaundryCompleted = {
  getListNewCustomer: async () => {
    try {
      const response = await axiosPrivate.get(
        `/dashboard/get-list-laundry-completed`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching customer requests:", error);
      throw error;
    }
  },
};

// DASHBOARD USER SECTION
export const getDashboard = {
  getDashboard: async (storeId) => {
    try {
      const response = await axiosPrivate.get(
        `/dashboard/${storeId}/get-calculated`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching customer requests:", error);
      throw error;
    }
  },
};

export const getAdminTotalRevenueWithStoreId = {
  getTotalRevenue: async (id) => {
    try {
      const response = await axiosPrivate.get(
        `/dashboard/${id}/get-total-revenue`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching customer requests:", error);
      throw error;
    }
  },
};

export const getAdminTotalLaundryOrdersWithStoreId = {
  getTotalLaundryOrders: async (id) => {
    try {
      const response = await axiosPrivate.get(
        `/dashboard/${id}/get-total-laundry-orders`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching customer requests:", error);
      throw error;
    }
  },
};

export const getAdminTotalCustomersWithStoreId = {
  getTotalCustomers: async (id) => {
    try {
      const response = await axiosPrivate.get(
        `/dashboard/${id}/get-total-customers`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching customer requests:", error);
      throw error;
    }
  },
};

export const getAdminTotalLaundryLoadWithStoreId = {
  getTotalLaundryLoad: async (id) => {
    try {
      const response = await axiosPrivate.get(
        `/dashboard/${id}/get-total-laundry-load`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching customer requests:", error);
      throw error;
    }
  },
};

// WITH STORE ID ITS TABLE
export const getTableListReadyForDeliveryAndAttemptedDelivery = {
  getTableListReadyDelivery: async (id) => {
    try {
      const response = await axiosPrivate.get(
        `/dashboard/${id}/get-list-ready-for-delivery`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching customer requests:", error);
      throw error;
    }
  },
};

export const getListStoreAndCustomerLocation = {
  getStoreCustomerLocation: async () => {
    try {
      const response = await axiosPrivate.get(
        `/dashboard/get-store-customer-location`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching customer requests:", error);
      throw error;
    }
  },
};

// TOP MOST USE SERVICE
export const getListTopMostUseService = {
  getTopMostUseService: async () => {
    try {
      const response = await axiosPrivate.get(
        `/dashboard/get-most-use-service`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching customer requests:", error);
      throw error;
    }
  },
};

// #UNIT MONITORED SECTION
export const getCalculatedTransaction = {
  getTransaction: async (assignmentId) => {
    try {
      const response = await axiosPrivate.get(
        `/monitored-unit/${assignmentId}/get-calculated-transaction`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching customer requests:", error);
      throw error;
    }
  },
};

export const getInventoryLaundryItem = {
  getInventoryItem: async (storeId) => {
    try {
      const response = await axiosPrivate.get(
        `/monitored-unit/${storeId}/get-laundry-item`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching customer requests:", error);
      throw error;
    }
  },
};

export const getCountRequestInQueue = {
  getCountInQueue: async (storeId) => {
    try {
      const response = await axiosPrivate.get(
        `/monitored-unit/${storeId}/count-inqueue`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching customer requests:", error);
      throw error;
    }
  },
};

export const getCountLaundryAssignment = {
  getCountAssignment: async (storeId) => {
    try {
      const response = await axiosPrivate.get(
        `/monitored-unit/${storeId}/count-assignment`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching laundry assignment:", error);
      throw error;
    }
  },
};

export const getAssignmentInProgress = {
  getInProgress: async (storeId) => {
    try {
      const response = await axiosPrivate.get(
        `/monitored-unit/${storeId}/get-assignment`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching laundry assignment:", error);
      throw error;
    }
  },
};

export const getUnitName = {
  getSuggestedUnitName: async (storeId) => {
    try {
      const response = await axiosPrivate.get("/get-unitname", {
        params: { store_id: storeId }, // Use query parameters
      });
      const { success, unit_name } = response.data;
      if (success) {
        return { success, unit_name };
      } else {
        throw new Error("Failed to fetch suggested unit name.");
      }
    } catch (error) {
      throw handleError(error);
    }
  },
};

export const viewRequestInQueue = {
  getRequestInQueue: async (storeId) => {
    try {
      const response = await axiosPrivate.get(
        `/monitored-unit/${storeId}/get-inqueue`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching customer requests:", error);
      throw error;
    }
  },
};

export const viewUnits = {
  getUnitsList: async (storeId) => {
    try {
      const response = await axiosPrivate.get("/view-units", {
        params: { store_id: storeId },
      });
      const { success, data } = response.data;

      if (success) {
        return { success, data };
      } else {
        throw new Error("Failed to fetch units list.");
      }
    } catch (error) {
      throw handleError(error);
    }
  },
};

export const viewUnitAvailable = {
  getUnitAvailable: async (storeId) => {
    try {
      const response = await axiosPrivate.get(
        `/monitored-unit/${storeId}/unit-available`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching:", error);
      throw error;
    }
  },
};

export const getListCustomer = {
  getSelectedCustomer: async (storeId) => {
    try {
      const response = await axiosPrivate.get(
        `/monitored-unit/${storeId}/get-inqueue`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching customer requests:", error);
      throw error;
    }
  },
};

export const getSelectedCustomer = {
  getSelectCustomer: async (storeId) => {
    try {
      const response = await axiosPrivate.get(
        `/monitored-unit/${storeId}/get-customer`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching selected customer:", error);
      throw error;
    }
  },
};

export const getServiceType = {
  getService: async (storeId) => {
    try {
      const response = await axiosPrivate.get(
        `/unit/${storeId}/get-service-types`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching selected customer:", error);
      throw error;
    }
  },
};

// #MANAGE SCHEDULES SECTION
export const viewScheduleRequestStatsByAdmin = {
  getScheduleRequestStatsByAdmin: async () => {
    try {
      const response = await axiosPrivate.get(
        "/schedules/admin-get-schedules-stats"
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export const viewScheduleRequestStatsByUser = {
  getScheduleRequestStatsByUser: async (storeId) => {
    try {
      const response = await axiosPrivate.get(
        `/schedules/${storeId}/user-get-schedules-stats`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export const viewScheduleRequestByUser = {
  getScheduleRequestByUser: async (storeId) => {
    try {
      const response = await axiosPrivate.get(
        `/schedules/${storeId}/user-get-schedules`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export const getSelectedStaff = {
  getSelectStaff: async (storeId) => {
    try {
      const response = await axiosPrivate.get(
        `/schedules/${storeId}/get-assign-staff`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching selected customer:", error);
      throw error;
    }
  },
};

// INVENTORY SECTION
export const getCategoryItem = {
  getCategory: async () => {
    try {
      const response = await axiosPrivate.get("/get-category");

      if (response.status === 200) {
        return { success: true, data: response.data };
      } else {
        throw new Error("Failed to fetch category items.");
      }
    } catch (error) {
      return handleError(error);
    }
  },
};

export const viewInventory = {
  getViewInventoryList: async (storeId) => {
    try {
      const response = await axiosPrivate.get("/inventory/view-inventory", {
        params: { store_id: storeId },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export const viewGetItemToReuse = {
  getItemToReuse: async (id) => {
    try {
      const response = await axiosPrivate.get(
        `/inventory/${id}/view-item-reuse`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export const viewCategory = {
  getViewCategoryList: async (storeId) => {
    try {
      const response = await axiosPrivate.get("/view-category", {
        params: { store_id: storeId },
      });
      const { success, data } = response.data;

      if (success) {
        return { success, data };
      } else {
        throw new Error("Failed to fetch category list.");
      }
    } catch (error) {
      throw handleError(error);
    }
  },
};

// #STORE SECTION
export const viewStore = {
  getStoreList: async (data) => {
    try {
      const response = await axiosPrivate.get("/view-store", data);
      const { success, message, data: storeData } = response.data;

      if (success) {
        return { success, message, data: storeData };
      } else {
        throw new Error(message || "Failed.");
      }
    } catch (error) {
      throw handleError(error);
    }
  },
};

export const viewStoreByAdmin = {
  getStoreByAdmin: async () => {
    try {
      const response = await axiosPrivate.get("/stores/admin-get-stores");
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

// #USER MANAGEMENT SECTION
export const viewUser = {
  getUser: async (userId) => {
    try {
      const response = await axiosPrivate.get(`/user/${userId}/admin-get-user`);
      return response.data;
    } catch (error) {
      console.error("Error fetching:", error);
      throw error;
    }
  },
};

// #For get role and permission
export const viewRolesAndPermissions = {
  getRoleAndPermission: async (userId) => {
    try {
      const response = await axiosPrivate.get(
        `/usermanage/${userId}/admin-get-role-permissions`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching:", error);
      throw error;
    }
  },
};

// #For get store list based admin
export const viewAdminBasedStore = {
  getAdminBasedStore: async (userId) => {
    try {
      const response = await axiosPrivate.get(
        `/usermanage/${userId}/admin-get-store`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching:", error);
      throw error;
    }
  },
};

// #For get users list based admin
export const viewAdminBasedUser = {
  getAdminBasedUser: async (userId) => {
    try {
      const response = await axiosPrivate.get(
        `/usermanage/${userId}/admin-get-user`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching:", error);
      throw error;
    }
  },
};

export const getListUserByStore = {
  getAdminBasedUser: async (id, params) => {
    try {
      const response = await axiosPrivate.get(
        `/usermanage/${id}/get-user-list`,
        {
          params,
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching:", error);
      throw error;
    }
  },
};

//#CUSTOMER MANAGEMENT SECTION
export const getCustomerList = {
  viewCustomerList: async (id) => {
    try {
      const response = await axiosPrivate.get(
        `/customer-management/${id}/get-customer-list`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching:", error);
      throw error;
    }
  },
};

export const getCustomerGrowthOverTime = {
  viewCustomerGrow: async (id) => {
    try {
      const response = await axiosPrivate.get(
        `/customer-management/${id}/get-customer-growth-overtime`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching:", error);
      throw error;
    }
  },
};

//#INBOX SECTION
export const getInbox = {
  viewInbox: async (userId) => {
    try {
      const response = await axiosPrivate.get(`/inbox/${userId}/get-inbox`);
      return response.data;
    } catch (error) {
      console.error("Error fetching:", error);
      throw error;
    }
  },
};

export const getInboxAdmin = {
  viewInboxAdmin: async (userId) => {
    try {
      const response = await axiosPrivate.get(
        `/inbox/${userId}/get-inbox-admin`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching:", error);
      throw error;
    }
  },
};
//#FEEDBACK AND REVIEWS SECTION
export const getReviews = {
  viewReviews: async (id) => {
    try {
      const response = await axiosPrivate.get(`/reviews/${id}/get-reviews`);
      return response.data;
    } catch (error) {
      console.error("Error fetching:", error);
      throw error;
    }
  },
};

//#SERVICES MANAGEMENT SECTION
export const getServicesTypeList = {
  viewServicesType: async (id) => {
    try {
      const response = await axiosPrivate.get(
        `/services-management/${id}/get-services-type-list`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching:", error);
      throw error;
    }
  },
};

export const getPromoList = {
  viewPromo: async (id) => {
    try {
      const response = await axiosPrivate.get(
        `/services-management/${id}/get-services-promo-list`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching:", error);
      throw error;
    }
  },
};

//#TRANSACTON HISTORY SECTION
export const getTransactionHistory = {
  viewTransctionHistory: async (id) => {
    try {
      const response = await axiosPrivate.get(
        `/transaction-history/${id}/get-transaction-history`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching:", error);
      throw error;
    }
  },
};

export const getTransactionSalesByMonth = {
  viewSalesByMonth: async (id) => {
    try {
      const response = await axiosPrivate.get(
        `/transaction-history/${id}/get-transaction-sales-by-month`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching:", error);
      throw error;
    }
  },
};

export const getCustomerTypeStats = {
  viewCustomerStats: async (id) => {
    try {
      const response = await axiosPrivate.get(
        `/transaction-history/${id}/get-customer-types-stats`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching:", error);
      throw error;
    }
  },
};

//#ACTIVITY LOG SECTION
export const getActivityLog = {
  viewActivityLog: async () => {
    try {
      const response = await axiosPrivate.get(
        `/activity-logs/get-activity-log`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching:", error);
      throw error;
    }
  },
};

export const getActivityLogStats = {
  viewActivityLogStats: async () => {
    try {
      const response = await axiosPrivate.get(
        `/activity-logs/get-activity-log-stats`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching:", error);
      throw error;
    }
  },
};

// #SETTINGS SECTION
//  <----- Service Type Section ----->
export const getServiceTypeAndStore = {
  getServiceType: async (userId) => {
    try {
      const response = await axiosPrivate.get(
        `/settings/${userId}/get-service-types`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching:", error);
      throw error;
    }
  },
};

// ---> CUSTOMER SECTION <---

//  <----- Laundry Services Section ----->
// export const getCustomerServiceType = {
//   getServiceType: async (userId) => {
//     try {
//       const response = await axiosPrivate.get(
//         `/settings/${userId}/get-service-types`
//       );
//       return response.data;
//     } catch (error) {
//       console.error("Error fetching:", error);
//       throw error;
//     }
//   },
// };

//  <----- Track Order Section ----->
// export const getCustomerTrackOrder = {
//   getServiceType: async (userId) => {
//     try {
//       const response = await axiosPrivate.get(
//         `/settings/${userId}/get-service-types`
//       );
//       return response.data;
//     } catch (error) {
//       console.error("Error fetching:", error);
//       throw error;
//     }
//   },
// };
