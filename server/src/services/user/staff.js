import { io } from "../../socket/socket.js";
import { haversineDistance } from "../../helpers/distanceComputing.js";
import { logNotification } from "../useExtraSystem.js";
import {
  NotificationDescriptions,
  NotificationStatus,
} from "../../helpers/notificationLog.js";

// POST
export const handleSetMessagesSenderIsStaff = async (req, res, connection) => {
  const { sender_id, receiver_id, message } = req.body; // sender_id = staff ID, receiver_id = customer ID
  try {
    // Begin transaction
    await connection.beginTransaction();

    const findConversationQuery = `
      SELECT id FROM Conversations 
      WHERE (user_sender_id IS NULL AND customer_sender_id = ? AND user_receiver_id = ?) OR 
            (customer_sender_id IS NULL AND user_sender_id = ? AND customer_receiver_id = ?)
      LIMIT 1
    `;

    const [conversationRows] = await connection.query(findConversationQuery, [
      receiver_id, // Customer ID who started the conversation
      sender_id, // User (staff) ID who is replying
      sender_id, // User (staff) ID who is replying
      receiver_id, // Customer ID who is receiving the reply
    ]);

    let conversation_id;

    // If no conversation exists, create a new one
    if (conversationRows.length === 0) {
      const insertConversationQuery = `
        INSERT INTO Conversations (user_sender_id, customer_sender_id, user_receiver_id, customer_receiver_id, last_message, last_message_date, created_at, updated_at)
        VALUES (?, NULL, NULL, ?, ?, NOW(), NOW(), NOW())
      `;

      const [newConversationResult] = await connection.query(
        insertConversationQuery,
        [sender_id, receiver_id, message]
      );
      conversation_id = newConversationResult.insertId; // Get the new conversation ID
      console.log("Created new conversation with ID:", conversation_id); // Debugging: Log new conversation ID
    } else {
      conversation_id = conversationRows[0].id; // Use the existing conversation ID
      console.log("Using existing conversation with ID:", conversation_id); // Debugging: Log existing conversation ID
    }

    // Insert the new message into the Messages table
    const insertMessageQuery = `
      INSERT INTO Messages (conversation_id, sender_id, receiver_id, sender_type, receiver_type, message, created_at, isRead) 
      VALUES (?, ?, ?, 'User', 'Customer', ?, NOW(), 0)
    `;

    await connection.query(insertMessageQuery, [
      conversation_id,
      sender_id,
      receiver_id,
      message,
    ]);

    const updateConversationQuery = `
      UPDATE Conversations 
      SET last_message = ?, last_message_date = NOW() 
      WHERE id = ?
    `;
    await connection.query(updateConversationQuery, [message, conversation_id]);

    await connection.commit();

    res.status(201).json({
      success: true,
      message: "Message sent successfully.",
    });
  } catch (error) {
    await connection.rollback();
    console.error("Error while sending message:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while sending the message.",
    });
  } finally {
    connection.release();
  }
};

// GET
export const handleGetLaundryPickup = async (req, res, connection) => {
  const { id } = req.params;
  const { user_id } = req.query;

  try {
    await connection.beginTransaction();

    const query = `
        SELECT 
          sr.id AS request_id,
          c.id AS customer_id,
          sr.customer_fullname,
          sr.request_date,
          sr.pickup_date,
          sr.delivery_date,
          sr.request_status,
          st.service_name,
          st.default_price,
          a.address_line,
          a.latitude AS customer_latitude,
          a.longitude AS customer_longitude,
          store_address.latitude AS store_latitude,
          store_address.longitude AS store_longitude,
          (
            SELECT COUNT(*)
            FROM Messages m
            INNER JOIN Conversations conv ON conv.id = m.conversation_id
            WHERE m.is_read = 0 
            AND m.recipient_id = ?
          ) AS unread_messages
        FROM 
          Service_Request sr
        INNER JOIN 
          Service_Type st ON sr.service_type_id = st.id
        INNER JOIN 
          User_Account c ON sr.customer_id = c.id
        INNER JOIN 
          Addresses a ON c.address_id = a.id
        INNER JOIN 
          Stores s ON sr.store_id = s.id
        INNER JOIN 
          Addresses store_address ON s.address_id = store_address.id 
        WHERE 
          sr.store_id = ? 
          AND sr.request_status IN ('Pending Pickup', 'Ongoing Pickup', 'Canceled')
          AND st.isArchive = 0
          AND c.isArchive = 0
      `;

    const [rows] = await connection.execute(query, [user_id, id]);

    // Compute distances for each row
    const resultsWithDistance = rows.map((row) => {
      const distance = haversineDistance(
        row.store_latitude,
        row.store_longitude,
        row.customer_latitude,
        row.customer_longitude
      );
      const formattedDistance = `${distance.toFixed(2)} km`;
      return {
        ...row,
        distance: formattedDistance,
      };
    });

    await connection.commit();

    res.status(200).json({
      success: true,
      data: resultsWithDistance,
    });
  } catch (error) {
    await connection.rollback();
    console.error("Error fetching service requests:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching data.",
    });
  } finally {
    if (connection) connection.release();
  }
};

export const handleGetNotificationStaff = async (req, res, connection) => {
  const { id } = req.params;

  try {
    await connection.beginTransaction();

    const query = `
      SELECT 
        n.id,
        n.store_id,
        n.user_id,
        n.notification_type,
        n.notification_description,
        n.status,
        n.created_at,
        n.read_at
      FROM Notifications n
      WHERE n.store_id = ?
      ORDER BY n.created_at DESC
    `;

    const [rows] = await connection.execute(query, [id]);

    if (rows.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No notifications found for this store.",
        data: [],
      });
    }

    return res.status(200).json({
      success: true,
      message: "Notifications fetched successfully.",
      data: rows,
    });
  } catch (error) {
    await connection.rollback();
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching data.",
      error: error.message,
    });
  } finally {
    if (connection) connection.release();
  }
};

export const handleGetDelivery = async (req, res, connection) => {
  const { id } = req.params;
  const { user_id } = req.query;

  try {
    await connection.beginTransaction();

    const query = `
        SELECT 
          sr.id AS request_id,
          c.id AS customer_id,
          sr.customer_fullname,
          sr.request_date,
          sr.pickup_date,
          sr.delivery_date,
          sr.request_status,
          sr.payment_method,
          st.service_name,
          st.default_price,
          a.address_line,
          a.latitude AS customer_latitude,
          a.longitude AS customer_longitude,
          store_address.latitude AS store_latitude,
          store_address.longitude AS store_longitude,
          (
            SELECT COUNT(*)
            FROM Messages m
            WHERE m.is_read = 0 
            AND m.recipient_id = ?
            AND m.conversation_id IN (
              -- Subquery to find conversation between user_id and customer_id
              SELECT conv.id
              FROM Conversations conv
              WHERE 
                (conv.user_one_id = ? AND conv.user_two_id = c.id) 
                OR 
                (conv.user_one_id = c.id AND conv.user_two_id = ?)
            )
          ) AS unread_messages
        FROM 
          Service_Request sr
        INNER JOIN 
          Service_Type st ON sr.service_type_id = st.id
        INNER JOIN 
          User_Account c ON sr.customer_id = c.id
        INNER JOIN 
          Addresses a ON c.address_id = a.id
        INNER JOIN 
          Stores s ON sr.store_id = s.id
        INNER JOIN 
          Addresses store_address ON s.address_id = store_address.id 
        WHERE 
          sr.store_id = ? 
          AND sr.request_status IN ('Ready for Delivery', 'Out for Delivery', 'Completed Delivery')
          AND st.isArchive = 0
          AND c.isArchive = 0
      `;

    const [rows] = await connection.execute(query, [
      user_id,
      user_id,
      user_id,
      id,
    ]);

    // Compute distances for each row
    const resultsWithDistance = rows.map((row) => {
      const distance = haversineDistance(
        row.store_latitude,
        row.store_longitude,
        row.customer_latitude,
        row.customer_longitude
      );
      const formattedDistance = `${distance.toFixed(2)} km`;
      return {
        ...row,
        distance: formattedDistance,
      };
    });

    await connection.commit();

    res.status(200).json({
      success: true,
      data: resultsWithDistance,
    });
  } catch (error) {
    await connection.rollback();
    console.error("Error fetching service requests:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching data.",
    });
  } finally {
    if (connection) connection.release();
  }
};

// PUT
//#PENDING CANCEL
export const handleUpdateServiceRequestCancel = async (
  req,
  res,
  connection
) => {
  const { id } = req.params;
  const { user_id } = req.body;

  try {
    await connection.beginTransaction();

    const getCustomerIdQuery = `
      SELECT customer_id 
      FROM Service_Request 
      WHERE id = ?
    `;
    const [customerRows] = await connection.execute(getCustomerIdQuery, [id]);

    if (customerRows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Request not found." });
    }

    const { customer_id } = customerRows[0];

    const updateQuery = `
      UPDATE Service_Request
      SET request_status = 'Canceled', user_id = ?
      WHERE id = ?
    `;
    const [result] = await connection.execute(updateQuery, [user_id, id]);

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Failed to update request status." });
    }

    // Log notification
    const notificationType = NotificationStatus.CANCELED;
    const notificationDescription =
      NotificationDescriptions[notificationType]();

    await logNotification(
      connection,
      null,
      customer_id,
      notificationType,
      notificationDescription
    );

    io.emit("sendNotificationToUser", {
      userId: customer_id,
      message: "Your service request has been canceled.",
    });

    await connection.commit();

    res.status(200).json({
      success: true,
      message: "Request status updated to canceled.",
    });
  } catch (error) {
    await connection.rollback();
    console.error("Error updating service request status:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while updating the request.",
    });
  } finally {
    connection.release();
  }
};

//#PENDING TO ONGOING
export const handleUpdateServiceRequestOngoing = async (
  req,
  res,
  connection
) => {
  const { id } = req.params;
  const { user_id } = req.body;

  try {
    await connection.beginTransaction();

    const updateQuery = `
      UPDATE Service_Request
      SET request_status = 'Ongoing Pickup', user_id = ?
      WHERE id = ?`;

    await connection.execute(updateQuery, [user_id, id]);

    const updateProgressQuery = `
      UPDATE Service_Progress
      SET completed = true,
          status_date = NOW()
      WHERE service_request_id = ? AND stage = 'Ongoing Pickup'`;

    await connection.execute(updateProgressQuery, [id]);

    await connection.commit();

    res.status(200).json({
      success: true,
      message: "Request status updated to Ongoing Pickup.",
    });
  } catch (error) {
    await connection.rollback();
    res.status(500).json({
      success: false,
      message: "An error occurred while updating the request.",
    });
  } finally {
    connection.release();
  }
};

//#ONGOING TO PENDING
export const handleUpdateServiceRequestBackToPending = async (
  req,
  res,
  connection
) => {
  const { id } = req.params;
  const { user_id } = req.body;

  try {
    await connection.beginTransaction();

    const updateQuery = `
          UPDATE Service_Request
          SET request_status = 'Pending Pickup', user_id = NULL
          WHERE id = ?`;

    await connection.execute(updateQuery, [id]);

    const updateProgressQuery = `
      UPDATE Service_Progress
      SET completed = false,
          status_date = NULL
      WHERE service_request_id = ? AND stage = 'Ongoing Pickup'`;

    await connection.execute(updateProgressQuery, [id]);

    await connection.commit();

    res.status(200).json({
      success: true,
      message: "Request status updated to Pending Pickup.",
    });
  } catch (error) {
    await connection.rollback();
    console.error("Error updating service request status:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while updating the request.",
    });
  } finally {
    connection.release();
  }
};

//#ONGOING TO COMPLETED
export const handleUpdateServiceRequestFinishPickup = async (
  req,
  res,
  connection
) => {
  const { id } = req.params;

  try {
    await connection.beginTransaction();

    const updateQuery = `
          UPDATE Service_Request
          SET request_status = 'Completed Pickup',
            pickup_date = NOW(),
            isPickup = TRUE
          WHERE id = ?`;

    await connection.execute(updateQuery, [id]);

    const updateProgressQuery = `
      UPDATE Service_Progress
      SET completed = true,
          status_date = NOW()
      WHERE service_request_id = ? AND stage = 'Completed Pickup'`;

    await connection.execute(updateProgressQuery, [id]);

    await connection.commit();

    res.status(200).json({
      success: true,
      message: "Request status updated to Completed Pickup.",
    });
  } catch (error) {
    await connection.rollback();
    console.error("Error updating service request status:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while updating the request.",
    });
  } finally {
    connection.release();
  }
};

export const handleUpdateServiceRequestReadyDeliveryToOngoing = async (
  req,
  res,
  connection
) => {
  const { id } = req.params;

  try {
    await connection.beginTransaction();

    const updateQuery = `
      UPDATE Service_Request
      SET request_status = 'Out for Delivery'
      WHERE id = ?`;

    await connection.execute(updateQuery, [id]);

    const updateProgressQuery = `
      UPDATE Service_Progress
      SET completed = true,
          status_date = NOW()
      WHERE service_request_id = ? AND stage = 'Out for Delivery'`;

    await connection.execute(updateProgressQuery, [id]);

    await connection.commit();

    res.status(200).json({
      success: true,
      message: "Request status updated to Completed Pickup.",
    });
  } catch (error) {
    await connection.rollback();
    console.error("Error updating service request status:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while updating the request.",
    });
  } finally {
    connection.release();
  }
};

export const handleUpdateServiceRequestFinishTheDelivery = async (
  req,
  res,
  connection
) => {
  const { id } = req.params;

  try {
    await connection.beginTransaction();

    const updateQuery = `
      UPDATE Service_Request
      SET request_status = 'Completed Delivery',
          delivery_date = NOW(),
          isDelivery = TRUE
      WHERE id = ?`;

    await connection.execute(updateQuery, [id]);

    const updateProgressQuery = `
      UPDATE Service_Progress
      SET completed = true,
          status_date = NOW()
      WHERE service_request_id = ? AND stage = 'Completed Delivery'`;

    await connection.execute(updateProgressQuery, [id]);

    // Get the assignment_id from Laundry_Assignment for the given service_request_id
    const getAssignmentQuery = `
      SELECT id
      FROM Laundry_Assignment
      WHERE service_request_id = ? AND isAssignmentStatus = 1`; // Assuming `1` means Completed

    const [assignmentResult] = await connection.execute(getAssignmentQuery, [
      id,
    ]);

    if (assignmentResult.length === 0) {
      throw new Error(
        "No completed assignment found for this service request."
      );
    }

    const assignmentId = assignmentResult[0].id;

    const updateTransactionQuery = `
      UPDATE Transactions
      SET status = 'Completed', updated_at = NOW()
      WHERE assignment_id = ?`;

    await connection.execute(updateTransactionQuery, [assignmentId]);

    await connection.commit();

    res.status(200).json({
      success: true,
      message:
        "Request status updated to Completed Delivery, and transaction marked as Completed.",
    });
  } catch (error) {
    await connection.rollback();
    console.error("Error updating service request status:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while updating the request.",
    });
  } finally {
    connection.release();
  }
};

//#SCAN QRCODE
export const handleUpdateServiceRequestUsingQrCode = async (
  req,
  res,
  connection
) => {
  const { id } = req.params;
  const { code, user_id } = req.body;

  console.log(user_id);

  try {
    await connection.beginTransaction();

    // Step 1: Check if the tracking code exists in the Service_Request table
    const [existingRequest] = await connection.execute(
      `SELECT request_status, isPickup, isDelivery FROM Service_Request WHERE id = ? AND tracking_code = ?`,
      [id, code]
    );

    if (existingRequest.length === 0) {
      return res
        .status(200)
        .json({ success: false, message: "Service request not found." });
    }

    const { request_status, isPickup, isDelivery } = existingRequest[0];

    // Step 2: Check the request_status to determine availability
    if (
      request_status === "Canceled" ||
      request_status === "Completed Delivery"
    ) {
      return res.status(200).json({
        success: false,
        message: "This service request is not available anymore.",
      });
    }

    // Step 3: Check if isPickup is false and update the status to "Completed Pickup"
    if (
      !isPickup &&
      (request_status === "Pending Pickup" ||
        request_status === "Ongoing Pickup")
    ) {
      await connection.execute(
        `UPDATE Service_Request SET user_id = ?, request_status = ?,  pickup_date = NOW(), isPickup = ? WHERE id = ?`,
        [user_id, "Completed Pickup", true, id]
      );

      await connection.execute(
        `UPDATE Service_Progress 
         SET completed = true,
             status_date = NOW()
         WHERE service_request_id = ? AND (stage = 'Ongoing Pickup' OR stage = 'Completed Pickup')`,
        [id]
      );
    }
    // New Step: If isPickup is true and request_status is "Completed Pickup"
    else if (
      isPickup && // Only check if pickup is completed
      (request_status === "Ready for Delivery" ||
        request_status === "Out for Delivery")
    ) {
      await connection.execute(
        `UPDATE Service_Request SET request_status = ?,  delivery_date = NOW(), isDelivery = ? WHERE id = ?`,
        ["Completed Delivery", true, id]
      );

      await connection.execute(
        `UPDATE Service_Progress 
         SET completed = true,
             status_date = NOW()
         WHERE service_request_id = ? AND (stage = 'Out for Delivery' OR stage = 'Completed Delivery')`,
        [id]
      );

      // Get the assignment_id from Laundry_Assignment for the given service_request_id
      const [assignmentResult] = await connection.execute(
        `SELECT id 
       FROM Laundry_Assignment 
       WHERE service_request_id = ? AND isAssignmentStatus = 1`, // Assuming '1' indicates Completed
        [id]
      );

      if (assignmentResult.length > 0) {
        const assignmentId = assignmentResult[0].id;

        // Update the Transactions status to "Completed" for the obtained assignment_id
        await connection.execute(
          `UPDATE Transactions 
           SET status = 'Completed', 
               updated_at = NOW() 
           WHERE assignment_id = ?`,
          [assignmentId]
        );
      }
    } else {
      return res.status(200).json({
        success: false,
        message: "Invalid request status or pickup/delivery already completed.",
      });
    }

    // Step 4: Commit the transaction if everything is fine
    await connection.commit();
    res.status(200).json({
      success: true,
      message: "Service request updated successfully.",
    });
  } catch (error) {
    await connection.rollback();
    console.error("Database operation error:", error);
    res.status(500).json({ message: "Error updating service request." });
  } finally {
    if (connection) connection.release();
  }
};
