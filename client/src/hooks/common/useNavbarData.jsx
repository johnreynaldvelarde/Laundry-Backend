import React, { useCallback, useState, useEffect } from "react";
import useFetchData from "./useFetchData";
import { getNotificationsList } from "../../services/api/customerApi";
import useSocket from "./useSocket";
import { getListAdminUserNotifications } from "../../services/api/getApi";

const useNavbarData = ({ userDetails }) => {
  const { socket } = useSocket();
  const [loading, setLoading] = useState(true);
  const { data: notifications, fetchData: fetchNotifications } = useFetchData();
  const { data: message, fetchData: fetchMessage } = useFetchData();

  const fetchNotificationsData = useCallback(async () => {
    if (!userDetails || !userDetails.roleName) {
      console.warn("userDetails not populated yet.");
      return; // Exit if userDetails isn't available yet
    }

    setLoading(true);

    const isCustomer = userDetails.roleName === "Customer";
    const id = isCustomer ? userDetails.userId : userDetails.storeId;
    const fetchFn = isCustomer
      ? getNotificationsList.getNotifications
      : getListAdminUserNotifications.getAdminUserNotifications;

    // console.log("Role:", userDetails.roleName);
    // console.log("Is customer:", isCustomer);
    // console.log("Using fetch function:", fetchFn.name);
    // console.log("Using ID:", id);

    await fetchNotifications(fetchFn, id);

    setLoading(false);
  }, [
    fetchNotifications,
    userDetails.roleName,
    userDetails.userId,
    userDetails.storeId,
  ]);

  useEffect(() => {
    if (socket) {
      socket.emit("register", userDetails.userId);

      // // Listen for notifications
      // socket.on("newNotification", (notification) => {
      //   console.log("Received newNotification:", notification);
      //   // Handle the notification (e.g., update state or UI)
      // });

      // return () => {
      //   socket.off("newNotification"); // Cleanup the listener on unmount
      // };
    }
  }, [socket, userDetails.userId]);

  return { loading, fetchNotificationsData, notifications };
};

export default useNavbarData;
