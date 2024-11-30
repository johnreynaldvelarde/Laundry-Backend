import { axiosPrivate } from "../../api/axios";

const handleError = (error) => {
  const message =
    error.response?.data?.message || "An unexpected error occurred.";
  return new Error(message);
};

// #UNIT MONITORED SECTION
export const createUnit = {
  setUnit: async (data) => {
    try {
      const response = await axiosPrivate.post(
        "/monitored-unit/create-unit",
        data
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export const createNewInqueue = {
  setInQueue: async (storeId, data) => {
    try {
      const response = await axiosPrivate.post(
        `/monitored-unit/${storeId}/set-customer-inqueue`,
        data
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export const createLaundryAssignment = {
  setLaundryAssignment: async (data) => {
    try {
      const response = await axiosPrivate.post(
        `/monitored-unit/set-new-assignment`,
        data
      );
      return response.data;
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  },
};

export const createWalkInServiceRequest = {
  setWalkInRequest: async (storeId, data) => {
    try {
      const response = await axiosPrivate.post(
        `/unit-monitor/${storeId}/set-walkin`,
        data
      );
      return response.data;
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  },
};

export const createNewTransactionOnline = {
  setTransactionOnline: async (data) => {
    try {
      const response = await axiosPrivate.post(
        `/monitored-unit/set-new-transaction-online`,
        data
      );
      return response.data;
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  },
};

export const createNewTransactionWalkIn = {
  setTransactionWalkIn: async (data) => {
    try {
      const response = await axiosPrivate.post(
        `/monitored-unit/set-new-transaction-walkin`,
        data
      );
      return response.data;
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  },
};

// #STORE SECTION
export const createNewStore = {
  setNewStore: async (data) => {
    try {
      const response = await axiosPrivate.post(`/stores/set-new-stores`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export const createStore = {
  setStore: async (data) => {
    try {
      const response = await axiosPrivate.post("/create-store", data);
      const { success, message } = response.data;

      if (success) {
        return { success, message };
      } else {
        throw new Error(message || "Failed to create branch");
      }
    } catch (error) {
      // Log the error message before throwing the error
      const errorMessage =
        error.response?.data?.message ||
        "Cannot Get the message for the server";
      console.log(errorMessage); // Log the message
      throw new Error(errorMessage); // Re-throw the error with the message
    }
  },
};

// #INVENTORY SECTION
export const createNewItem = {
  setNewItem: async (data) => {
    try {
      const response = await axiosPrivate.post(
        "/inventory/create-new-item",
        data
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export const createItemCategory = {
  setCategoryItem: async (data) => {
    try {
      const response = await axiosPrivate.post(
        "/inventory/create-category-item",
        data
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export const createReuseItem = {
  setReuseItem: async (data) => {
    try {
      const response = await axiosPrivate.post(
        "/inventory/create-reuse-item",
        data
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

// #USER MANAGEMENT SECTION
export const createNewRoleAndPermissions = {
  setRoleAndPermissons: async (userId, data) => {
    try {
      const response = await axiosPrivate.post(
        `/usermanage/${userId}/set-role-permisions`,
        data
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export const createAdminBasedNewUser = {
  setAdminBasedNewUser: async (data) => {
    try {
      const response = await axiosPrivate.post(
        `/usermanage/set-new-user`,
        data
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

// #CUSTOMER CUSTOMER SECTION
export const createNewCustomerAccount = {
  setCustomerAccount: async (data) => {
    try {
      const response = await axiosPrivate.post(
        `/customer-management/set-new-customer-account`,
        data
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

//#INBOX
export const createMessageSenderAdmin = {
  setCustomerMessageAdmin: async (data) => {
    try {
      const response = await axiosPrivate.post(
        `/inbox/set-new-messsages-admin`,
        data
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

//#SERVICES MANAGEMENT SECTION
export const createNewServicesPromo = {
  setServicesPromo: async (data) => {
    try {
      const response = await axiosPrivate.post(
        `/services-management/set-new-promo-service`,
        data
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

// SETTINGS SECTION
//  <----- Service Type Section ----->
export const createNewServiceType = {
  setServiceType: async (data) => {
    try {
      const response = await axiosPrivate.post(
        `/settings/set-service-types`,
        data
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

// Customer Section

// Activity Log Section
export const createActivityLog = {
  setActivtyLog: async (userId, data) => {
    try {
      const response = await axiosPrivate.post(
        `/activity/${userId}/post-log`,
        data
      );
      return response.data;
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  },
};
