import moment from "moment-timezone";

const currentTimestamp = moment()
  .tz("Asia/Manila")
  .format("YYYY-MM-DD HH:mm:ss");

export const logActivity = async (
  connection,
  userId,
  userType,
  actionType,
  actionDescription
) => {
  try {
    await connection.execute(
      "INSERT INTO Activity_Log (user_id, user_type, action_type, action_description, timestamp) VALUES (?, ?, ?, ?, NOW())",
      [userId, userType, actionType, actionDescription]
    );
  } catch (error) {
    console.error("Error logging activity:", error);
  }
};

export const logNotification = async (
  connection,
  storeId,
  userId,
  notification_type,
  notification_description
) => {
  const query = `
        INSERT INTO Notifications (store_id, user_id, notification_type, notification_description, status, created_at, read_at)
        VALUES (?, ?, ?, ?, ?, NOW(), ?)
      `;

  await connection.beginTransaction();

  try {
    await connection.execute(query, [
      storeId,
      userId,
      notification_type,
      notification_description,
      "Unread",
      null,
    ]);

    await connection.commit();
  } catch (error) {
    await connection.rollback();
    console.error("Error logging notification:", error);
  }
};
