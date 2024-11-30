import { Server } from "socket.io";

let io;

const userSockets = {};

const setupSocketIO = (server) => {
  io = new Server(server, {
    cors: {
      origin:
        process.env.NODE_ENV === "production"
          ? process.env.PRODUCTION_FRONTEND_URL
          : process.env.DEVELOPMENT_FRONTEND_URL,
      methods: ["GET", "POST"],
      allowedHeaders: ["Content-Type", "Authorization"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log(`A user connected: ${socket.id}`);
    socket.on("register", (userId) => {
      userSockets[userId] = socket.id;
      console.log(`User ${userId} registered with socket ID: ${socket.id}`);
    });

    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.id}`);

      for (let userId in userSockets) {
        if (userSockets[userId] === socket.id) {
          delete userSockets[userId];
          console.log(`User ${userId} removed from socket list`);
          break;
        }
      }
    });
  });

  return io;
};

export { setupSocketIO, io };

// // Handle 'addItem' event - Notify all clients
// socket.on("addItem", (item) => {
//   io.emit("newItem", item); // Notify all clients about the new item
// });

// // Handle 'sendMessage' event - Notify all clients
// socket.on("sendMessage", (message) => {
//   io.emit("newMessage", message); // Notify all clients about the new message
// });

// // Handle 'sendNotification' event for all users
// socket.on("sendNotification", (notification) => {
//   console.log(
//     "Received 'sendNotification' event with notification:",
//     notification
//   );

//   // Emit the notification to all clients
//   io.emit("newNotification", notification);

//   console.log("Notification sent to all users");
// });

// socket.on("sendNotificationToUser", (notification) => {
//   const { userId, message } = notification;

//   console.log("Received sendNotificationToUser event with:", notification); // Log when the event is received

//   console.log("All connected users (userSockets):", userSockets); // Log userSockets map to see connected users

//   if (userSockets[userId]) {
//     console.log(`Sending notification to user ${userId}`); // Log before emitting to the specific user
//     io.to(userSockets[userId]).emit("newNotification", notification); // Emit to specific user
//     console.log(`Notification sent to user ${userId}: ${message}`);
//   } else {
//     console.log(`User with ID ${userId} is not connected`);
//   }
// });
