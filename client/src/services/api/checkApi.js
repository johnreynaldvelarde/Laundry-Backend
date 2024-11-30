import { axiosPrivate } from "./axios";

export const checkCustomerDetails = {
  getCheckCustomerDetails: async (id) => {
    try {
      const response = await axiosPrivate.get(
        `customers/${id}/check-customer-details-web`
      );

      if (response.data.success) {
        const { storeIdIsNull, addressIsNull } = response.data.data;
        return { storeIdIsNull, addressIsNull };
      } else {
        return { success: false, message: response.data.message };
      }
    } catch (error) {
      return { success: false, message: "Failed to check customer details" };
    }
  },
};
