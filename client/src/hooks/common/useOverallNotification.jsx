import { useState, useEffect } from "react";
import showNotification from "../../utils/showNotification";

const useOverallNotification = (initialMessage) => {
  const [notification, setNotification] = useState(null);

  // Function to show a new notification
  const triggerNotification = (message) => {
    setNotification({ message });
    showNotification({ message }); // Display the notification
  };

  // Function to close the notification
  const closeNotification = () => setNotification(null);

  // Automatically trigger the initial notification
  useEffect(() => {
    if (initialMessage) {
      triggerNotification(initialMessage);
    }
  }, [initialMessage]);

  return { notification, triggerNotification, closeNotification };
};

export default useOverallNotification;
