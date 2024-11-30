import { axiosPrivate } from "../../api/axios";

// #POST
export const createCustomerServiceRequest = {
  setCustomerServiceRequest: async (customerId, data) => {
    try {
      const response = await axiosPrivate.post(
        `/customers/${customerId}/set-service-request`,
        data
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export const createMessageSenderCustomer = {
  setCustomerMessage: async (data) => {
    try {
      const response = await axiosPrivate.post(
        `/customers/set-new-messsages`,
        data
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export const createFeedbackAndReview = {
  setFeedbackReview: async (data) => {
    try {
      const response = await axiosPrivate.post(
        `/customers/set-feedback-review`,
        data
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

// #GET

export const getServicePromoHeader = {
  getPromoHeader: async (storeId) => {
    try {
      const response = await axiosPrivate.get(
        `/customers/${storeId}/get-service-promo-list`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching:", error);
      throw error;
    }
  },
};

export const getCustomerServiceAndPromotions = {
  getServiceWithPromotions: async (storeId) => {
    try {
      const response = await axiosPrivate.get(
        `/customers/${storeId}/get-service-types`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching:", error);
      throw error;
    }
  },
};

//  <----- Track Order Section ----->
export const getCustomerTrackOrderAndProgress = {
  getCustomerTrackOrder: async (userId) => {
    try {
      const response = await axiosPrivate.get(
        `/customers/${userId}/get-track-order`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching:", error);
      throw error;
    }
  },
};

export const getCalculatedTransactionForCustomer = {
  getTransactionCustomer: async (assignmentId) => {
    try {
      const response = await axiosPrivate.get(
        `/customers/${assignmentId}/get-calculated-transaction`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching customer requests:", error);
      throw error;
    }
  },
};

export const getPaymentHistory = {
  getHistory: async (id) => {
    try {
      const response = await axiosPrivate.get(
        `/customers/${id}/get-payment-history`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching customer requests:", error);
      throw error;
    }
  },
};

//  <----- Get Customer Message ----->
export const getChatMessages = {
  getMessages: async (user_one_id, user_two_id) => {
    try {
      const response = await axiosPrivate.get(
        `/customers/${user_one_id}/${user_two_id}/get-messages`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching:", error);
      throw error;
    }
  },
};

export const getNotificationsList = {
  getNotifications: async (id) => {
    try {
      const response = await axiosPrivate.get(
        `/customers/${id}/get-notifications-customer`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching customer requests:", error);
      throw error;
    }
  },
};

// #PUT
export const updateNotificationClearAll = {
  putUpdateProfile: async (id, data) => {
    try {
      const response = await axiosPrivate.put(
        `/customers/${id}/update-notifications-customer-clear-all`,
        data
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching:", error);
      throw error;
    }
  },
};

export const updateMessageisRead = {
  putMessageisRead: async (user_one_id, user_two_id) => {
    try {
      const response = await axiosPrivate.put(
        `/customers/${user_one_id}/${user_two_id}/put-update-message`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching:", error);
      throw error;
    }
  },
};

export const updateCustomerProfile = {
  putUpdateProfile: async (id, data) => {
    try {
      const response = await axiosPrivate.put(
        `/customers/${id}/update-profile`,
        data
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching:", error);
      throw error;
    }
  },
};

export const updateCustomerAddress = {
  putUpdateAddress: async (id, data) => {
    try {
      const response = await axiosPrivate.put(
        `/customers/${id}/update-address`,
        data
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching:", error);
      throw error;
    }
  },
};

export const updateCustomerPassword = {
  putUpdatePassword: async (id, data) => {
    try {
      const response = await axiosPrivate.put(
        `/customers/${id}/update-reset-password`,
        data
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching:", error);
      throw error;
    }
  },
};

export const updateCustomerChangeStore = {
  putUpdateChangeStore: async (id, data) => {
    try {
      const response = await axiosPrivate.put(
        `/customers/${id}/update-change-store`,
        data
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching:", error);
      throw error;
    }
  },
};
