import React, { useRef, useState } from "react";
import useAuth from "../../contexts/AuthContext";
import { viewUser } from "../../services/api/getApi";

const useUser = () => {
  const { userDetails } = useAuth();
  const [userData, setUserData] = useState([]);
  const [loading, setLoading] = useState(true);

  const isFetchUserData = useRef(false);

  const fetchUserData = async () => {
    if (isFetchUserData.current) return;
    if (userDetails?.storeId) {
      try {
        const response = await viewUser.getUser(userDetails.userId);
        if (response) {
          setUserData(response.stores);
          console.log(response.stores);
          isFetchUserData.current = true;
        } else {
          alert("Failed to fetch customer request data.");
        }
      } catch (error) {
        alert(error.message);
        setLoading(false);
      }
    } else {
      console.error("Store ID is undefined.");
    }
  };

  const getUserRole = (isRole) => {
    switch (isRole) {
      case 0:
        return "Admin";
      case 1:
        return "Manager";
      case 2:
        return "Staff";
      default:
        return "Unknown";
    }
  };

  const getUserisOnline = (isOnline) => {
    switch (isOnline) {
      case 0:
        return "Offline";
      case 1:
        return "Online";
      default:
        return "Unknown";
    }
  };

  return {
    loading,
    fetchUserData,
    userData,
    userDetails,
    getUserRole,
    getUserisOnline,
  };
};

export default useUser;
