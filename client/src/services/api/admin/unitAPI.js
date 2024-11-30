import { axiosPublic } from "../axios";

const handleError = (error) => {
  console.error("API Error:", error);
  const message =
    error.response?.data?.message || "An unexpected error occurred.";
  return new Error(message);
};

// Create new unit
const createUnit = {
  login: async (data) => {
    try {
      const response = await axiosPublic.post("/create-unit", data);
      const { success, message } = response.data;

      if (success) {
        return { success, message };
      } else {
        throw new Error(message || "Create Unit is failed.");
      }
    } catch (error) {
      throw handleError(error);
    }
  },
};


// Get branch list
const viewUnit = {
  login: async (data) => {
    try {
      const response = await axiosPublic.post("/view-unit", data);
      const { success, message } = response.data;

      if (success) {
        return { success, message };
      } else {
        throw new Error(message || "Unit View failed.");
      }
    } catch (error) {
      throw handleError(error);
    }
  },
};

export { createBranch, viewBranch };
