import { axiosPrivate, axiosPublic } from "../api/axios";

const handleError = (error) => {
  console.error("API Error:", error);

  const message =
    error.response?.data?.message || "An unexpected error occurred.";
  return new Error(message);
};

// Login Service
export const loginService = {
  login: async (data) => {
    try {
      const response = await axiosPrivate.post("/login", data);
      const {
        success,
        userId,
        userType,
        roleName,
        permissions,
        accessToken,
        message,
      } = response.data;

      if (success) {
        return {
          success,
          userId,
          userType,
          roleName,
          permissions,
          accessToken,
        };
      } else {
        throw new Error(message || "Login failed.");
      }
    } catch (error) {
      throw handleError(error);
    }
  },

  // Google Login
  googleLogin: async () => {
    try {
      const response = await axiosPublic.get("/auth/google");
      const { success, userId, userType, accessToken, message } = response.data;

      if (success) {
        return {
          success,
          userId,
          userType,
          accessToken,
        };
      } else {
        throw new Error(message || "Google login failed.");
      }
    } catch (error) {
      throw handleError(error);
    }
  },
};

// Register Service
export const registerService = {
  register: async (data) => {
    try {
      const response = await axiosPrivate.post("/register", data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export const checkUsername = {
  getCheckUsername: async (data) => {
    try {
      const response = await axiosPublic.post("/check-username", data);
      return response.data;
    } catch (error) {
      console.error("Error checking username:", error);
      throw error;
    }
  },
};

export const isEmailExist = {
  setIsEmailExist: async (data) => {
    try {
      const response = await axiosPublic.post("/is-email-exist", data);
      return response.data;
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  },
};
