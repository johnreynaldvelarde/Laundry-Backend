import { axiosPrivate } from "../../api/axios";

export const updateCustomerBasicInformation = {
  setCustomerInformation: async (customerId, data) => {
    try {
      const response = await axiosPrivate.put(
        `/customers/${customerId}/start`,
        data
      );
      return response.data;
    } catch (error) {
      console.error("Error updating customer information:", error);
      throw error;
    }
  },
};

//#UNIT MONITORED SECTION
export const updateEditUnit = {
  putUpdateUnit: async (id, data) => {
    console.log(id);
    try {
      const response = await axiosPrivate.put(
        `/monitored-unit/${id}/update-edit-unit`,
        data
      );
      return response.data;
    } catch (error) {
      console.error("Error updating unit:", error);
      throw error;
    }
  },
};

export const updateRemoveUnit = {
  putRemoveUnit: async (id) => {
    try {
      const response = await axiosPrivate.put(
        `/monitored-unit/${id}/remove-laundry-unit`
      );
      return response.data;
    } catch (error) {
      console.error("Error updating unit:", error);
      throw error;
    }
  },
};

export const updateProgressInQueueAtStore = {
  putProgressInQueueAtStore: async (id) => {
    try {
      const response = await axiosPrivate.put(
        `/monitored-unit/${id}/update-inqueue-generate-number`
      );
      return response;
    } catch (error) {
      console.error("Error updating assignment:", error);
      throw error;
    }
  },
};

export const updateRemoveInQueue = {
  putRemoveInQueue: async (inqueueID) => {
    try {
      const response = await axiosPrivate.put(
        `/user/${inqueueID}/remove-request`
      );
      return response.data;
    } catch (error) {
      console.error("Error updating assignment:", error);
      throw error;
    }
  },
};

export const updateRemoveAssignment = {
  putAssignment: async (assignmentID) => {
    try {
      const response = await axiosPrivate.put(
        `/user/${assignmentID}/update-assignment`
      );
      return response.data;
    } catch (error) {
      console.error("Error updating assignment:", error);
      throw error;
    }
  },
};

//#VIEW SCHEDULES
export const updatePendingToAssign = {
  putPendingUpdateToAssign: async (id, data) => {
    try {
      const response = await axiosPrivate.put(
        `/schedules/${id}/update-pending-assign`,
        data
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export const updateCompletedPickupToAtStore = {
  putCompletedAtStore: async (id) => {
    try {
      const response = await axiosPrivate.put(
        `/schedules/${id}/update-completed-pickup-at-store`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export const updateAtStoreToInQueue = {
  putAtStoreInQueue: async (id) => {
    try {
      const response = await axiosPrivate.put(
        `/schedules/${id}/update-at-store-in-queue`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

//#INVENTORY SECTION
export const updateCategoryName = {
  putCategoryName: async (id, data) => {
    try {
      const response = await axiosPrivate.put(
        `/inventory/${id}/update-category-name`,
        data
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export const updateRemoveCategory = {
  putRemoveCategory: async (id, data) => {
    try {
      const response = await axiosPrivate.put(
        `/inventory/${id}/update-remove-category`,
        data
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export const updateStock = {
  putStock: async (id, data) => {
    try {
      const response = await axiosPrivate.put(
        `/inventory/${id}/update-stock`,
        data
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export const updateInventory = {
  putInventory: async (id, data) => {
    try {
      const response = await axiosPrivate.put(
        `/inventory/${id}/update-edit-item`,
        data
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export const updateRemoveItem = {
  putRemoveItem: async (id, data) => {
    try {
      const response = await axiosPrivate.put(
        `/inventory/${id}/update-remove-item`,
        data
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

//#STORE MANAGEMENT SECTION
export const updateStoreDetails = {
  putStoreDetails: async (id, data) => {
    try {
      const response = await axiosPrivate.put(
        `/stores/${id}/update-store`,
        data
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

//#USER MANAGEMENT SECTION
// #For role and permission
export const updateRemoveRole = {
  putRemoveRole: async (roleId, data) => {
    try {
      const response = await axiosPrivate.put(
        `/usermanage/${roleId}/update-remove-role`,
        data
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export const updatePermissions = {
  putPermissions: async (roleId, data) => {
    try {
      const response = await axiosPrivate.put(
        `/usermanage/${roleId}/update-permissions`,
        data
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export const updateRenameRole = {
  putRenameRole: async (roleId, data) => {
    try {
      const response = await axiosPrivate.put(
        `/usermanage/${roleId}/update-rename-role`,
        data
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

// #Admin
export const updateAdminBasedUser = {
  putAdminBasedUser: async (userId, data) => {
    try {
      const response = await axiosPrivate.put(
        `/usermanage/${userId}/update-admin-based-user`,
        data
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export const updateRemoveUser = {
  putRemoveUser: async (userId, data) => {
    try {
      const response = await axiosPrivate.put(
        `/usermanage/${userId}/update-remove-user`,
        data
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

// #Manager
export const updateManagerBasedUser = {
  putManagerBasedUser: async (userId, data) => {
    try {
      const response = await axiosPrivate.put(
        `/usermanage/${userId}/update-manager-based-user`,
        data
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

//#FEEDBACK AND REVIEWS SECTION
export const updateReviews = {
  putReviews: async (id, data) => {
    try {
      const response = await axiosPrivate.put(
        `/reviews/${id}/update-reviews`,
        data
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

//#SERVICES MANAGEMENT SECTION
export const updateServicePromo = {
  putPromo: async (id, data) => {
    try {
      const response = await axiosPrivate.put(
        `/services-management/${id}/update-service-promo`,
        data
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export const updateServicePromoDeactived = {
  putPromoDeactived: async (id) => {
    try {
      const response = await axiosPrivate.put(
        `/services-management/${id}/update-promo-deactivated`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export const updateServicePromoActived = {
  putPromoActived: async (id) => {
    try {
      const response = await axiosPrivate.put(
        `/services-management/${id}/update-promo-activated`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export const updateServiceDelete = {
  putPromo: async (id, data) => {
    try {
      const response = await axiosPrivate.put(
        `/services-management/${id}/update-service-delete`,
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
export const updateServiceType = {
  putServiceType: async (serviceId, data) => {
    try {
      const response = await axiosPrivate.put(
        `/settings/${serviceId}/update-service-types`,
        data
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export const updateDeleteServiceType = {
  putDeleteServiceType: async (id) => {
    try {
      const response = await axiosPrivate.put(
        `/settings/${id}/delete-service-types`
      );
      return response.data;
    } catch (error) {
      console.error("Error updating assignment:", error);
      throw error;
    }
  },
};
