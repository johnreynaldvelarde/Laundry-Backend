import { useState, useEffect } from "react";
import { io } from "socket.io-client";

// Define the socket server URL
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL;

const useSocket = () => {
  const [socket, setSocket] = useState(null);

  // This effect will run once when the component mounts
  useEffect(() => {
    // Initialize socket connection when the component mounts
    const newSocket = io(SOCKET_URL);
    setSocket(newSocket);

    // Listen for 'newNotification' event from the server
    newSocket.on("newNotification", (notification) => {
      console.log("Received newNotification:", notification);
      fetchNotificationsData(); // Assuming this is a function to trigger some UI update
    });

    // Cleanup the socket when the component unmounts
    return () => {
      newSocket.disconnect();
    };
  }, []); // Empty dependency array ensures this runs only once (on mount)

  // Emit a message to the server
  const sendMessage = (message) => {
    if (socket) {
      socket.emit("sendMessage", message);
    } else {
      console.error("Socket is not connected.");
    }
  };

  // Emit a notification to the server
  const sendNotification = (notification) => {
    if (socket) {
      socket.emit("sendNotification", notification);
    } else {
      console.error("Socket is not connected.");
    }
  };

  return {
    socket,
    sendMessage,
    sendNotification,
  };
};

export default useSocket;
