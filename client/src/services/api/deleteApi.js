import { axiosPrivate } from "../../api/axios";

// USER MANAGEMENT SECTION
export const deleteRolePermissions = {
  deleteRole: async (roleID) => {
    try {
      const response = await axiosPrivate.put(
        `/usermanage/${roleID}/update-assignment`
      );
      return response.data;
    } catch (error) {
      console.error("Error updating assignment:", error);
      throw error;
    }
  },
};
