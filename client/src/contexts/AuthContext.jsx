import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useRef,
} from "react";
import { axiosPublic, axiosPrivate } from "../api/axios";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(null);
  const isFetchingRef = useRef(false);
  const [userDetails, setUserDetails] = useState({
    userId: "",
    storeId: "",
    addressId: "",
    firstname: "",
    middlename: "",
    lastname: "",
    email: "",
    phone: "",
    fullName: "",
    username: "",
    roleName: "",
    permissions: {
      canRead: false,
      canWrite: false,
      canEdit: false,
      canDelete: false,
    },
    address: {
      addressLine: "",
      country: "",
      region: "",
      province: "",
      city: "",
      postalCode: "",
      latitude: null,
      longitude: null,
    },
  });
  const [isLoading, setIsLoading] = useState(true);

  const refreshAccessToken = async () => {
    try {
      const response = await axiosPublic.get(`/refresh-token`, {
        withCredentials: true,
      });

      if (response.data.success) {
        const newAccessToken = response.data.accessToken;
        setAccessToken(newAccessToken);

        return newAccessToken;
      } else {
        // console.error("Error refreshing access token:", response.data.message);
      }
    } catch (error) {
      console.error("Error refreshing access token:", error);
    }
    return null;
  };

  const fetchUserDetails = async (token) => {
    if (!token || isFetchingRef.current) return; // Prevent duplicate fetches

    isFetchingRef.current = true; // Mark fetch as ongoing
    try {
      const response = await axiosPrivate(`/user/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        const user = response.data.user;

        if (user) {
          // Initialize user details with common properties
          const userDetails = {
            userId: user.userId,
            storeId: user.storeId,
            addressId: user.addressId,
            firstname: user.firstname,
            middlename: user.middlename,
            lastname: user.lastname,
            email: user.email,
            phone: user.phone,
            fullName: user.fullName,
            username: user.username,
            roleName: user.userType,
            address: {
              addressLine: user.address?.addressLine || "",
              country: user.address?.country || "",
              region: user.address?.region || "",
              province: user.address?.province || "",
              city: user.address?.city || "",
              postalCode: user.address?.postalCode || "",
              latitude: user.address?.latitude || null,
              longitude: user.address?.longitude || null,
            },
          };

          // Add roleName and permissions only if the user is not a customer
          if (user.userType !== "Customer") {
            userDetails.roleName = user.roleName || null;
            userDetails.permissions = {
              canRead: user.permissions?.canRead || false,
              canWrite: user.permissions?.canWrite || false,
              canEdit: user.permissions?.canEdit || false,
              canDelete: user.permissions?.canDelete || false,
            };
          }

          setUserDetails(userDetails);
        }
      } else {
        console.error("Error fetching user details:", response.data.message);
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
    } finally {
      isFetchingRef.current = false; // Mark fetch as completed
    }
  };

  useEffect(() => {
    const checkAccessToken = async () => {
      let token = accessToken;

      if (!token) {
        token = await refreshAccessToken();
      }

      if (token) {
        await fetchUserDetails(token);
      }

      setIsLoading(false);
    };

    checkAccessToken();
  }, [accessToken]);

  const value = {
    accessToken,
    setAccessToken,
    userDetails,
    setUser: setUserDetails,
    isLoading,
    setIsLoading,
    fetchUserDetails,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default useAuth;
