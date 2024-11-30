import { useAuth } from "../contexts/AuthContext";
import { axiosPublic } from "../services/api/axios";

const useLogout = () => {
  const { userDetails, setAccessToken, setUser, setIsLoading } = useAuth();

  const data = {
    user_id: userDetails.userId,
    username: userDetails.username,
    roleName: userDetails.roleName,
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      const response = await axiosPublic.post("/logout", data);

      console.log(response);

      if (response) {
        setAccessToken(null);
        setUser({
          userId: "",
          storeId: "",
          fullName: "",
          username: "",
        });

        window.location.href = "/";
      } else {
        console.error("Error during logout - No response from login endpoint");
      }
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return logout;
};

export default useLogout;
