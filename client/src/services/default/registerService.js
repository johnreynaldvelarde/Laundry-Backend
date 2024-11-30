import axios from "axios";

const registerService = {
  register: async (data) => {
    try {
      const response = await axios.post("http://localhost:3002/api/register", data);
      return response.data;
    } catch (error) {
      console.error("Error in registerService:", error);
      throw error;
    } 
  },
};

export default registerService;
