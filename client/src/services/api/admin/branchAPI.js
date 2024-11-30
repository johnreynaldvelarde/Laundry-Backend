import { axiosPrivate } from "../axios";

const handleError = (error) => {
  const message =
    error.response?.data?.message || "An unexpected error occurred.";
  return new Error(message);
};

// Create new branch
const createStore = {
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
      const errorMessage = error.response?.data?.message || 'Cannot Get the message for the server';
      console.log(errorMessage); // Log the message
      throw new Error(errorMessage); // Re-throw the error with the message
    }
  },
};

// Get branch list
const viewStore = {
  getStoreList: async (data) => {
    try {
      const response = await axiosPrivate.get("/view-store", data);
      const { success, message, data: storeData } = response.data;

      if (success) {
        return { success, message, data: storeData };
      } else {
        throw new Error(message || "Login failed.");
      }
    } catch (error) {
      throw handleError(error);
    }
  },
};

export { createStore, viewStore };
