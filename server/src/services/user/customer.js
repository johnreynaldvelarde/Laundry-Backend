import { io, userSockets } from "../../socket/socket.js";
import QRCode from "qrcode";
import { generateTrackingCode } from "../../helpers/generateCode.js";
import { progress } from "../../helpers/_progress.js";
import {
  comparePassword,
  generatePasswordSalt,
  hashPassword,
} from "../../helpers/auth.js";
import { logNotification } from "../useExtraSystem.js";
import {
  NotificationDescriptions,
  NotificationStatus,
} from "../../helpers/notificationLog.js";

// #POST
export const handleSetCustomerServiceRequest = async (req, res, connection) => {
  const { id } = req.params;
  const {
    store_id,
    service_type_id,
    service_name,
    customer_name,
    notes,
    payment_method,
  } = req.body;

  try {
    await connection.beginTransaction();

    const countQuery = `
      SELECT COUNT(*) AS request_count 
      FROM Service_Request 
      WHERE customer_id = ? 
        AND customer_type = 'Online'
        AND request_status NOT IN ('Canceled', 'Completed Delivery', 'Completed');
    `;

    const [countResult] = await connection.execute(countQuery, [id]);
    const requestCount = countResult[0].request_count;

    if (requestCount >= 2) {
      return res.status(200).json({
        success: false,
        message: "Max of 2 active requests allowed",
      });
    }

    const trackingCode = generateTrackingCode();

    const queueQuery = `
      SELECT IFNULL(MAX(queue_number), 0) + 1 AS next_queue_number
      FROM Service_Request
      WHERE store_id = ? 
        AND DATE(request_date) = CURDATE();
    `;

    const [queueResult] = await connection.execute(queueQuery, [store_id]);
    const queueNumber = queueResult[0].next_queue_number;

    const query = `
      INSERT INTO Service_Request (
          store_id,
          customer_id,
          service_type_id,
          customer_fullname,
          customer_type,
          notes,
          request_date,
          request_status,
          tracking_code,
          queue_number,
          qr_code_generated,
          payment_method
        ) 
      VALUES (?, ?, ?, ?, ?, ?, NOW(), ?, ?, ?, ?, ?)
    `;

    const [result] = await connection.execute(query, [
      store_id,
      id,
      service_type_id,
      customer_name,
      "Online",
      notes,
      "Pending Pickup",
      trackingCode,
      queueNumber,
      0,
      payment_method,
    ]);

    const newRequestId = result.insertId;

    const qrCodeData = `SR-${newRequestId}-${trackingCode}`;

    const qrCodeString = await QRCode.toDataURL(qrCodeData);

    const updateQuery = `
      UPDATE Service_Request 
      SET qr_code = ?, qr_code_generated = 1
      WHERE id = ?
    `;

    await connection.execute(updateQuery, [qrCodeData, newRequestId]);

    const progressQuery = `
      INSERT INTO Service_Progress (
          service_request_id,
          stage,
          description,
          status_date,
          completed,
          false_description
        ) 
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    for (const item of progress) {
      await connection.execute(progressQuery, [
        newRequestId,
        item.stage,
        item.description,
        item.completed ? new Date() : null,
        item.completed,
        item.falseDescription,
      ]);
    }

    const notificationType = NotificationStatus.PENDING_PICKUP_SENT_TO_STAFF;
    const notificationDescription = NotificationDescriptions[notificationType](
      customer_name,
      service_name
    );

    await logNotification(
      connection,
      store_id,
      null,
      notificationType,
      notificationDescription
    );

    await connection.commit();

    for (const userId in userSockets) {
      const userSocket = userSockets[userId];

      if (
        userSocket.storeId === store_id &&
        userSocket.userType !== "Customer"
      ) {
        io.to(userSocket.socketId).emit("notificationsModule", {
          title: notificationType,
          message: notificationDescription,
        });
      }
    }

    res.status(201).json({
      success: true,
      message: "Service request created!",
      service_request_id: newRequestId,
      qr_code: qrCodeData,
      queue_number: queueNumber,
    });
  } catch (error) {
    await connection.rollback();
    console.error("Error creating service request:", error);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    if (connection) connection.release();
  }
};

// #CUSTOMER MESSAGE THE DELIVERY STAFF
export const handleSetMessagesSenderIsCustomer = async (
  req,
  res,
  connection
) => {
  const { sender_id, receiver_id, message } = req.body;

  try {
    await connection.beginTransaction();

    const findConversationQuery = `
      SELECT id FROM Conversations 
      WHERE (customer_sender_id = ? AND user_receiver_id = ?) OR 
            (user_sender_id = ? AND customer_receiver_id = ?)
      LIMIT 1
    `;

    const [conversationRows] = await connection.query(findConversationQuery, [
      sender_id, // Customer ID who is sending the message
      receiver_id, // User (staff) ID who is receiving the message
      receiver_id, // User (staff) ID who is receiving the message
      sender_id, // Customer ID who is sending the message
    ]);

    // const findConversationQuery = `
    //   SELECT id FROM Conversations
    //   WHERE (user_sender_id = ? AND customer_receiver_id = ?) OR
    //         (customer_sender_id = ? AND user_receiver_id = ?)
    //   LIMIT 1
    // `;

    // const [conversationRows] = await connection.query(findConversationQuery, [
    //   sender_id,
    //   receiver_id,
    //   sender_id,
    //   receiver_id,
    // ]);

    let conversation_id;

    // If no conversation exists, create a new one
    if (conversationRows.length === 0) {
      const insertConversationQuery = `
        INSERT INTO Conversations (user_sender_id, customer_sender_id, user_receiver_id, customer_receiver_id, last_message, last_message_date, created_at, updated_at)
        VALUES (NULL, ?, ?, NULL, ?, NOW(), NOW(), NOW())
      `;

      const [newConversationResult] = await connection.query(
        insertConversationQuery,
        [sender_id, receiver_id, message]
      );
      conversation_id = newConversationResult.insertId; // Get the new conversation ID
    } else {
      conversation_id = conversationRows[0].id; // Use the existing conversation ID
    }

    // Insert the new message into the Messages table
    const insertMessageQuery = `
      INSERT INTO Messages (conversation_id, sender_id, receiver_id, sender_type, receiver_type, message, created_at, isRead) 
      VALUES (?, ?, ?, 'Customer', 'User', ?, NOW(), 0)
    `;

    // Execute the insert query
    await connection.query(insertMessageQuery, [
      conversation_id,
      sender_id,
      receiver_id,
      message,
    ]);

    // Update the last message and last message date in the Conversations table
    const updateConversationQuery = `
      UPDATE Conversations 
      SET last_message = ?, last_message_date = NOW() 
      WHERE id = ?
    `;
    await connection.query(updateConversationQuery, [message, conversation_id]);

    // Commit the transaction
    await connection.commit();

    // Send a successful response
    res.status(201).json({
      success: true,
      message: "Message sent successfully.",
    });
  } catch (error) {
    // Rollback the transaction in case of an error
    await connection.rollback();
    console.error("Error while sending message:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while sending the message.",
    });
  } finally {
    // Release the database connection
    connection.release();
  }
};

// FEEDBACK AND REVIEW
export const handleSetFeedbackAndReview = async (req, res, connection) => {
  const { store_id, user_id, service_request_id, rating, comment } = req.body;

  try {
    await connection.beginTransaction();

    const query = `
      INSERT INTO Feedback_Review 
      (store_id, customer_id, service_request_id, rating, comment, created_at, updated_at, is_approved) 
      VALUES (?, ?, ?, ?, ?, NOW(), NOW(), ?)`;

    const [result] = await connection.execute(query, [
      store_id,
      user_id,
      service_request_id,
      rating,
      comment,
      0,
    ]);

    await connection.commit();

    res.status(201).json({
      success: true,
      message: "Feedback and review submitted successfully.",
      data: { id: result.insertId }, // Optionally return the new feedback ID
    });
  } catch (error) {
    await connection.rollback();
    console.error("Error while submitting feedback and review:", error);
    res.status(500).json({
      success: false,
      message: "Failed to submit feedback and review. Please try again later.",
    });
  } finally {
    connection.release();
  }
};

// #GET
export const handleGetStoreList = async (req, res, db) => {
  try {
    const [rows] = await db.query(
      `SELECT s.id, 
              s.store_name,
              a.province,
              a.city, 
              a.address_line, 
              a.latitude, 
              a.longitude 
       FROM Stores s
       LEFT JOIN Addresses a ON s.address_id = a.id
       WHERE s.isArchive = 0`
    );

    res.status(200).json({
      success: true,
      data: rows,
    });
  } catch (error) {
    console.error("Error retrieving store list:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while retrieving the store list.",
    });
  }
};

export const handleGetServicePromoList = async (req, res, connection) => {
  const { id } = req.params; // store id

  try {
    await connection.beginTransaction();

    const query = `
     SELECT 
        st.id AS service_id,
        st.service_name,
        st.description,
        st.default_price,
        sp.discount_price,
        sp.valid_days,
        sp.start_date,
        sp.end_date
      FROM 
        Service_Type st
      JOIN 
        Service_Promo sp ON st.id = sp.service_id
      WHERE 
        st.store_id = ? AND                     
        sp.isActive = 1 AND                     
        sp.start_date <= NOW() AND             
        sp.end_date >= NOW()                 
      ORDER BY 
        st.service_name;
    `;

    const [rows] = await connection.execute(query, [id]);

    await connection.commit();

    res.status(200).json({
      success: true,
      data: rows,
    });
  } catch (error) {
    await connection.rollback();
    console.error("Error fetching service promos:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching data.",
    });
  } finally {
    if (connection) connection.release();
  }
};

export const handleGetServiceTypeAndPromotions = async (
  req,
  res,
  connection
) => {
  const { id } = req.params;

  try {
    await connection.beginTransaction();

    const query = `
      SELECT 
        st.id AS service_id,
        st.service_name,
        st.description,
        st.default_price,
        sp.id AS promotion_id,
        sp.discount_price,
        sp.valid_days,
        sp.start_date,
        sp.end_date,
        sp.isActive
      FROM 
        Service_Type st
      LEFT JOIN 
        Service_Promo sp ON st.id = sp.service_id 
          AND sp.isActive = 1 
          AND sp.isArchive = 0 
          AND (sp.start_date IS NULL OR sp.start_date <= CURDATE())
          AND (sp.end_date IS NULL OR sp.end_date >= CURDATE())
      WHERE 
        st.store_id = ? 
        AND st.isArchive = 0
    `;

    const [rows] = await connection.execute(query, [id]);

    await connection.commit();

    res.status(200).json({
      success: true,
      data: rows,
    });
  } catch (error) {
    await connection.rollback();
    console.error("Error fetching services and promotions:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching data.",
    });
  } finally {
    if (connection) connection.release();
  }
};

export const handleGetCustomerConvo = async (req, res, connection) => {
  const { id } = req.params;

  try {
    await connection.beginTransaction();

    const query = `
      SELECT
        m.id AS message_id,
        m.conversation_id,
        m.sender_id,
        m.receiver_id,
        m.sender_type,
        m.receiver_type,
        m.message,
        m.created_at,
        c.last_message,
        c.last_message_date
      FROM
        Messages m
      JOIN
        Conversations c ON m.conversation_id = c.id
      WHERE
        c.customer_sender_id = ? OR c.customer_receiver_id = ?
      ORDER BY
        m.created_at ASC
    `;

    const [rows] = await connection.execute(query, [id, id]);

    await connection.commit();

    res.status(200).json({
      success: true,
      data: rows,
    });
  } catch (error) {
    await connection.rollback();
    console.error("Error fetching messages:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching messages.",
    });
  } finally {
    connection.release();
  }
};

//#TRACKING ORDER
export const handleGetCustomerTrackOrderAndProgress = async (
  req,
  res,
  connection
) => {
  const { id } = req.params; // customer_id or means rece

  try {
    await connection.beginTransaction();

    const query = `
      SELECT 
        sr.id AS service_request_id,
        sr.store_id,
        IF(sr.user_id IS NULL, false, sr.user_id) AS user_id,
        sr.customer_id,
        sr.tracking_code,
        sr.customer_fullname,
        sr.customer_type,
        sr.notes,
        COALESCE(CONCAT(ua.first_name, ' ', ua.middle_name, ' ', ua.last_name), 'Waiting...') AS username,
        sr.request_date,
        COALESCE(sr.pickup_date, 'Waiting...') AS pickup_date,
        COALESCE(sr.delivery_date, 'Waiting...') AS delivery_date,
        sr.request_status,
        sr.qr_code,
        sr.qr_code_generated, 
        sr.isPickup,
        sr.isDelivery,
        sp.id AS progress_id,
        sp.stage,
        sp.description,
        sp.completed,
        sp.false_description,
        sp.status_date,
        st.service_name,
        st.default_price,
        COALESCE(lu.unit_name, 'Waiting...') AS unit_name,
        COALESCE(la.id, 'Waiting for total amount...') AS assignment_id,
        COALESCE(t.status, 'Waiting...') AS transaction_status,
        COALESCE(sr.payment_method, 'Waiting...') AS payment_method,
        (
          SELECT COUNT(*)
          FROM Messages m
          INNER JOIN Conversations conv ON conv.id = m.conversation_id
          WHERE m.is_read =   0 
          AND m.recipient_id = ?
        ) AS unread_messages,
        promo.discount_price,
        promo.isActive,
        promo.valid_days,
        promo.start_date,
        promo.end_date  
      FROM 
        Service_Request sr
      LEFT JOIN 
        Service_Progress sp ON sr.id = sp.service_request_id
      LEFT JOIN 
        User_Account ua ON sr.user_id = ua.id
      LEFT JOIN 
        Service_Type st ON sr.service_type_id = st.id
      LEFT JOIN 
        Service_Promo promo ON st.id = promo.service_id AND promo.isActive = 1 
      LEFT JOIN 
        Laundry_Assignment la ON sr.id = la.service_request_id
      LEFT JOIN 
        Laundry_Unit lu ON la.unit_id = lu.id
      LEFT JOIN 
        Transactions t ON la.id = t.assignment_id
      LEFT JOIN 
        Feedback_Review fr ON sr.id = fr.service_request_id
      WHERE 
        sr.customer_id = ? 
        AND sr.request_status != 'Canceled'
        AND sr.customer_type = 'Online'
        AND fr.id IS NULL
      ORDER BY 
        sr.request_date DESC;
    `;

    const [rows] = await connection.execute(query, [id, id]);

    const result = rows.reduce((acc, row) => {
      let serviceRequest = acc.find(
        (req) => req.service_request.id === row.service_request_id
      );

      if (!serviceRequest) {
        serviceRequest = {
          service_request: {
            id: row.service_request_id,
            store_id: row.store_id,
            user_id: row.user_id,
            user_name: row.username,
            customer_id: row.customer_id,
            service_type_id: row.service_type_id,
            service_name: row.service_name,
            service_default_price: row.default_price,
            tracking_code: row.tracking_code,
            customer_fullname: row.customer_fullname,
            customer_type: row.customer_type,
            notes: row.notes,
            request_date: row.request_date,
            pickup_date: row.pickup_date,
            delivery_date: row.delivery_date,
            request_status: row.request_status,
            qr_code: row.qr_code,
            qr_code_generated: row.qr_code_generated,
            isPickup: row.isPickup,
            isDelivery: row.isDelivery,
            unit_name: row.unit_name,
            assignment_id: row.assignment_id,
            transaction_status: row.transaction_status,
            payment_method: row.payment_method,
            unread_messages: row.unread_messages,
            promo_discount_price: row.discount_price,
            promo_is_active: row.isActive,
            promo_valid_days: row.valid_days,
            promo_start_date: row.start_date,
            promo_end_date: row.end_date,
          },
          progress: [],
          total_amount: null,
        };
        acc.push(serviceRequest);
      }

      serviceRequest.progress.push({
        id: row.progress_id,
        stage: row.stage,
        description: row.description,
        completed: row.completed,
        status_date: row.status_date,
        false_description: row.false_description,
      });

      return acc;
    }, []);

    // Fetch total amount if assignment_id exists
    // for (const serviceRequest of result) {
    //   const { assignment_id } = serviceRequest.service_request;

    //   if (assignment_id !== "Waiting for total amount...") {
    //     const amountQuery = `
    //       SELECT
    //         la.id AS laundry_assignment_id,
    //         sr.id AS service_request_id,
    //         st.default_price,
    //         la.weight,
    //         (st.default_price * la.weight) AS base_total_amount,
    //         sp.discount_price,
    //         sp.valid_days,
    //         sp.start_date,
    //         sp.end_date,
    //         sp.isActive,
    //         GROUP_CONCAT(inv.item_id SEPARATOR ', ') AS item_ids,
    //         GROUP_CONCAT(inv.price SEPARATOR ', ') AS item_prices,
    //         GROUP_CONCAT(it.item_name SEPARATOR ', ') AS item_names,
    //         GROUP_CONCAT(ri.quantity SEPARATOR ', ') AS quantities,
    //         GROUP_CONCAT(ri.amount SEPARATOR ', ') AS related_item_totals,
    //         SUM(ri.amount) AS total_related_items
    //       FROM
    //         Laundry_Assignment la
    //       INNER JOIN
    //         Service_Request sr ON la.service_request_id = sr.id
    //       INNER JOIN
    //         Service_Type st ON sr.service_type_id = st.id
    //       LEFT JOIN
    //         Service_Promo sp ON st.id = sp.service_id
    //       LEFT JOIN
    //         Related_Item ri ON la.id = ri.assignment_id
    //       LEFT JOIN
    //         Inventory inv ON ri.inventory_id = inv.id
    //       LEFT JOIN
    //         Item it ON inv.item_id = it.id
    //       WHERE
    //         la.id = ?
    //         AND (sp.isActive = 1 OR sp.id IS NULL)
    //         AND (sp.start_date IS NULL OR CURRENT_DATE BETWEEN sp.start_date AND sp.end_date)
    //       GROUP BY la.id;
    //     `;

    //     const [amountRows] = await connection.execute(amountQuery, [
    //       assignment_id,
    //     ]);

    //     if (amountRows.length > 0) {
    //       const {
    //         base_total_amount,
    //         discount_price,
    //         valid_days,
    //         isActive,
    //         total_related_items,
    //       } = amountRows[0];

    //       let final_total = parseFloat(base_total_amount);
    //       let discount_applied = null;

    //       if (
    //         isActive &&
    //         valid_days &&
    //         valid_days.includes(
    //           new Date().toLocaleString("en-US", { weekday: "long" })
    //         )
    //       ) {
    //         // Use discount_price if available
    //         if (discount_price > 0) {
    //           final_total = Math.max(
    //             final_total - parseFloat(discount_price),
    //             0
    //           ); // Ensure total does not go negative
    //           discount_applied = {
    //             type: "price",
    //             value: discount_price,
    //             amount: discount_price,
    //           };
    //         }
    //       }

    //       final_total += parseFloat(total_related_items || 0);
    //       serviceRequest.total_amount = final_total;
    //     }
    //   }
    // }

    for (const serviceRequest of result) {
      const { assignment_id } = serviceRequest.service_request;

      if (assignment_id !== "Waiting for total amount...") {
        const amountQuery = `
          SELECT 
            la.id AS laundry_assignment_id,
            sr.id AS service_request_id,
            st.default_price,
            la.weight,
            sp.discount_price,
            sp.valid_days,
            sp.start_date,
            sp.end_date,
            sp.isActive,
            GROUP_CONCAT(inv.item_id SEPARATOR ', ') AS item_ids,
            GROUP_CONCAT(inv.price SEPARATOR ', ') AS item_prices,
            GROUP_CONCAT(it.item_name SEPARATOR ', ') AS item_names,
            GROUP_CONCAT(ri.quantity SEPARATOR ', ') AS quantities,
            GROUP_CONCAT(ri.amount SEPARATOR ', ') AS related_item_totals,
            SUM(ri.amount) AS total_related_items
          FROM 
            Laundry_Assignment la
          INNER JOIN 
            Service_Request sr ON la.service_request_id = sr.id
          INNER JOIN 
            Service_Type st ON sr.service_type_id = st.id
          LEFT JOIN 
            Service_Promo sp ON st.id = sp.service_id
          LEFT JOIN 
            Related_Item ri ON la.id = ri.assignment_id
          LEFT JOIN 
            Inventory inv ON ri.inventory_id = inv.id
          LEFT JOIN
            Item it ON inv.item_id = it.id
          WHERE 
            la.id = ?
            AND (sp.isActive = 1 OR sp.isActive = 0 OR sp.id IS NULL)
            AND (sp.start_date IS NULL OR CURRENT_DATE BETWEEN sp.start_date AND sp.end_date)
          GROUP BY la.id;
        `;

        const [amountRows] = await connection.execute(amountQuery, [
          assignment_id,
        ]);

        if (amountRows.length > 0) {
          const {
            default_price,
            weight,
            discount_price,
            valid_days,
            isActive,
            total_related_items,
          } = amountRows[0];

          let final_total = 0;

          // Check if the promo is active and applicable
          if (
            isActive === 1 &&
            valid_days &&
            valid_days.includes(
              new Date().toLocaleString("en-US", { weekday: "long" })
            )
          ) {
            if (discount_price > 0) {
              final_total = parseFloat(discount_price) * parseFloat(weight);
            }
          }

          // If no active promo, use the default_price
          if (final_total === 0) {
            final_total = parseFloat(default_price) * parseFloat(weight);
          }

          // Add the total related items amount to final_total
          final_total += parseFloat(total_related_items || 0);
          serviceRequest.total_amount = final_total;
        }
      }
    }

    result.forEach((serviceRequest) => {
      serviceRequest.progress.sort((a, b) => a.id - b.id);
    });

    await connection.commit();

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    await connection.rollback();
    console.error("Error customer track order and progress:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching data.",
    });
  } finally {
    if (connection) connection.release();
  }
};

//#PAYMENT HISTORY
export const handleGetPaymentHistory = async (req, res, connection) => {
  const { id } = req.params; // customer_id (passed in the URL)

  try {
    await connection.beginTransaction();

    // Query to get payment history based on customer_id
    const query = `
      SELECT 
          t.id AS transaction_id,
          t.assignment_id,
          t.transaction_code,
          t.total_amount,
          t.payment_method,
          t.status AS transaction_status,
          t.created_at,
          t.updated_at,
          sr.customer_fullname,
          sr.customer_type,
          ri.quantity AS related_item_quantity,
          ri.amount AS related_item_amount,
          i.item_name AS related_item_name,
          la.weight,
          st.service_name,
          st.default_price
      FROM 
          Transactions t
      LEFT JOIN 
          Laundry_Assignment la ON t.assignment_id = la.id
      LEFT JOIN 
          Service_Request sr ON la.service_request_id = sr.id
      LEFT JOIN 
          Service_Type st ON st.id = sr.service_type_id
      LEFT JOIN 
          Related_Item ri ON ri.assignment_id = t.assignment_id
      LEFT JOIN 
          Inventory inv ON inv.id = ri.inventory_id
      LEFT JOIN 
          Item i ON i.id = inv.item_id
      WHERE 
          sr.customer_id = ?
          AND sr.customer_type = "Online"
          AND (i.isArchive = 0 OR i.isArchive IS NULL)
      ORDER BY 
          t.created_at DESC;
    `;

    // Execute the query with the provided customer_id
    const [rows] = await connection.execute(query, [id]);

    // Group the related items under each transaction
    const transactions = rows.reduce((acc, row) => {
      // Find the existing transaction
      let transaction = acc.find(
        (t) => t.transaction_id === row.transaction_id
      );

      // If the transaction doesn't exist, create a new one
      if (!transaction) {
        transaction = {
          transaction_id: row.transaction_id,
          assignment_id: row.assignment_id,
          transaction_code: row.transaction_code,
          total_amount: row.total_amount,
          payment_method: row.payment_method,
          transaction_status: row.transaction_status,
          created_at: row.created_at,
          updated_at: row.updated_at,
          customer_fullname: row.customer_fullname,
          customer_type: row.customer_type,
          service_name: row.service_name,
          weight: row.weight,
          default_price: row.default_price,
          related_items: [], // Initialize related items array
        };
        acc.push(transaction);
      }

      // If there's a related item, add it to the transaction's related items array
      if (row.related_item_name) {
        transaction.related_items.push({
          item_name: row.related_item_name,
          quantity: row.related_item_quantity,
          amount: row.related_item_amount,
        });
      }

      return acc;
    }, []);

    await connection.commit();

    res.status(200).json({
      success: true,
      data: transactions,
    });
  } catch (error) {
    await connection.rollback();
    console.error("Error fetching transaction history:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  } finally {
    if (connection) connection.release();
  }
};

export const handleGetCalculatedTransactionForCustomer = async (
  req,
  res,
  connection
) => {
  const { id } = req.params;

  try {
    await connection.beginTransaction();

    const query = `
      SELECT 
        la.id AS laundry_assignment_id,
        sr.id AS service_request_id,
        st.default_price,
        la.weight,
        sp.discount_price,
        sp.valid_days,
        sp.start_date,
        sp.end_date,
        sp.isActive,
        GROUP_CONCAT(inv.item_id SEPARATOR ', ') AS item_ids,
        GROUP_CONCAT(inv.price SEPARATOR ', ') AS item_prices,
        GROUP_CONCAT(it.item_name SEPARATOR ', ') AS item_names,
        GROUP_CONCAT(ri.quantity SEPARATOR ', ') AS quantities,
        GROUP_CONCAT(ri.amount SEPARATOR ', ') AS related_item_totals,
        SUM(ri.amount) AS total_related_items
      FROM 
        Laundry_Assignment la
      INNER JOIN 
        Service_Request sr ON la.service_request_id = sr.id
      INNER JOIN 
        Service_Type st ON sr.service_type_id = st.id
      LEFT JOIN 
        Service_Promo sp ON st.id = sp.service_id
      LEFT JOIN 
        Related_Item ri ON la.id = ri.assignment_id
      LEFT JOIN 
        Inventory inv ON ri.inventory_id = inv.id
      LEFT JOIN
        Item it ON inv.item_id = it.id
      WHERE 
        la.id = ?
        AND (sp.isActive = 1 OR sp.id IS NULL OR sp.isActive = 0)
        AND (sp.start_date IS NULL OR CURRENT_DATE BETWEEN sp.start_date AND sp.end_date)
      GROUP BY la.id;
    `;

    const [rows] = await connection.execute(query, [id]);

    if (rows.length > 0) {
      const {
        weight,
        default_price,
        discount_price,
        valid_days,
        isActive,
        item_ids,
        item_prices,
        item_names,
        quantities,
        start_date,
        end_date,
        related_item_totals,
        total_related_items,
      } = rows[0];

      let base_total_amount;
      let discount_applied = null;

      console.log(`Weight: ${weight}`);

      // Determine if promo applies; if not, use default price
      const currentDay = new Date().toLocaleString("en-US", {
        weekday: "long",
      });
      if (
        isActive === 1 &&
        valid_days &&
        valid_days.includes(currentDay) &&
        discount_price > 0
      ) {
        base_total_amount = discount_price * weight;
        discount_applied = {
          type: "promo_price",
          value: discount_price,
        };
        console.log(`Promo Active: Using discount price ${discount_price}`);
      } else {
        base_total_amount = default_price * weight;
        console.log(
          `No active promo or no promo data: Using default price ${default_price}`
        );
      }

      let final_total = base_total_amount;

      // Add total related items amount to the final total
      final_total += parseFloat(total_related_items || 0);

      // Parse item details into arrays
      const itemIdsArray = item_ids ? item_ids.split(", ") : [];
      const itemNamesArray = item_names ? item_names.split(", ") : [];
      const itemPricesArray = item_prices ? item_prices.split(", ") : [];
      const quantitiesArray = quantities ? quantities.split(", ") : [];
      const relatedItemTotalsArray = related_item_totals
        ? related_item_totals.split(", ")
        : [];

      res.status(200).json({
        success: true,
        data: {
          base_total_amount: base_total_amount.toFixed(2),
          weight,
          discount_applied,
          isActive,
          discount_price,
          valid_days,
          start_date,
          end_date,
          related_items: {
            item_ids: itemIdsArray,
            item_prices: itemPricesArray,
            item_names: itemNamesArray,
            quantities: quantitiesArray,
            related_item_totals: relatedItemTotalsArray,
          },
          total_related_items: total_related_items || 0,
          final_total: final_total.toFixed(2),
        },
      });
    } else {
      console.log("No valid data found or no active promo.");
      res.status(404).json({
        success: false,
        message: "No valid data found or no active promo.",
      });
    }

    await connection.commit();
  } catch (error) {
    await connection.rollback();
    console.error("Error fetching assignment:", error);
    res.status(500).json({
      success: false,
      error: "An error occurred while fetching the assignment.",
    });
  } finally {
    connection.release();
  }
};

export const handleGetNotificationCustomer = async (req, res, connection) => {
  const { id } = req.params; // user Id

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
      WHERE n.user_id = ? AND n.status = 'Unread'
      ORDER BY n.created_at DESC
    `;

    const [rows] = await connection.execute(query, [id]);

    if (rows.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No notifications found for this user.",
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

//#PUT
// NOTIFCATION CLEAR ALL
export const handleUpdateNotificationCustomerClearAll = async (
  req,
  res,
  connection
) => {
  const { id } = req.params; // user ID

  try {
    await connection.beginTransaction();

    const updateQuery = `
      UPDATE Notifications
      SET status = 'Read', read_at = NOW()
      WHERE user_id = ?
    `;
    const [result] = await connection.execute(updateQuery, [id]);

    await connection.commit();

    res.status(200).json({
      success: true,
      message:
        result.affectedRows > 0
          ? "All notifications marked as read."
          : "No notifications found to update.",
    });
  } catch (error) {
    await connection.rollback();
    console.error("Error updating notifications:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while updating notifications.",
      error: error.message,
    });
  } finally {
    if (connection) connection.release();
  }
};

// NOTIFCATION ONLY READ
export const handleUpdateNotificationCustomerOnlyRead = async (
  req,
  res,
  connection
) => {
  const { id } = req.params;

  try {
    await connection.beginTransaction();

    const updateQuery = `
      UPDATE Notifications
      SET status = 'Read', read_at = NOW()
      WHERE id = ?
    `;
    const [result] = await connection.execute(updateQuery, [id]);

    await connection.commit();

    res.status(200).json({
      success: true,
      message:
        result.affectedRows > 0
          ? "Notification marked as read."
          : "Notification not found.",
    });
  } catch (error) {
    await connection.rollback();
    console.error("Error updating notification:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while updating the notification.",
      error: error.message,
    });
  } finally {
    if (connection) connection.release();
  }
};

export const handleUpdateCustomerBasicInformationWeb = async (
  req,
  res,
  connection
) => {
  const { id } = req.params;
  const {
    store_id,
    address_line,
    country,
    province,
    city,
    postal_code,
    latitude,
    longitude,
  } = req.body;

  try {
    await connection.beginTransaction();

    const [addressResult] = await connection.execute(
      `INSERT INTO Addresses (address_line, country, province, city, postal_code, latitude, longitude, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, NOW())`,
      [address_line, country, province, city, postal_code, latitude, longitude]
    );

    const addressId = addressResult.insertId;

    await connection.execute(
      `UPDATE User_Account
         SET store_id = ?, address_id = ?
         WHERE id = ?`,
      [store_id, addressId, id]
    );

    await connection.commit();

    res
      .status(200)
      .json({ success: true, message: "Your info is now up-to-date!" });
  } catch (error) {
    await connection.rollback();
    console.error("Database operation error:", error);
    res.status(500).json({ message: "Error updating customer information" });
  } finally {
    connection.release();
  }
};

export const handleUpdateCustomerBasicInformationMobile = async (
  req,
  res,
  connection
) => {
  const { id } = req.params;
  const {
    store_id,
    address_line,
    country,
    region,
    province,
    city,
    postal_code,
    latitude,
    longitude,
  } = req.body;

  try {
    await connection.beginTransaction();

    const [addressResult] = await connection.execute(
      `INSERT INTO Addresses (address_line, country, region, province, city, postal_code, latitude, longitude, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
      [
        address_line,
        country,
        region,
        province,
        city,
        postal_code,
        latitude,
        longitude,
      ]
    );

    const addressId = addressResult.insertId;

    await connection.execute(
      `UPDATE User_Account
         SET store_id = ?, address_id = ?
         WHERE id = ?`,
      [store_id, addressId, id]
    );

    await connection.commit();

    res
      .status(200)
      .json({ success: true, message: "Your info is now up-to-date!" });
  } catch (error) {
    await connection.rollback();
    console.error("Database operation error:", error);
    res.status(500).json({ message: "Error updating customer information" });
  } finally {
    connection.release();
  }
};

export const handleUpdateCustomerProfile = async (req, res, connection) => {
  const { id } = req.params;
  const { mobile_number, email, username, firstname, middlename, lastname } =
    req.body;

  try {
    await connection.beginTransaction();

    const usernameCheckQuery = `
      SELECT COUNT(*) AS count
      FROM User_Account
      WHERE username = ? AND id != ?; 
    `;
    const [rows] = await connection.execute(usernameCheckQuery, [username, id]);

    if (rows[0].count > 0) {
      return res
        .status(200)
        .json({ message: "Username is already taken by another user." });
    }

    const updateQuery = `
      UPDATE User_Account
      SET 
        mobile_number = ?,
        email = ?,
        username = ?,
        first_name = ?,
        middle_name = ?,
        last_name = ?
      WHERE id = ?;  
    `;

    await connection.execute(updateQuery, [
      mobile_number,
      email,
      username,
      firstname,
      middlename,
      lastname,
      id,
    ]);

    await connection.commit();

    res
      .status(200)
      .json({ success: true, message: "Your info is now up-to-date!" });
  } catch (error) {
    await connection.rollback();
    console.error("Database operation error:", error);
    res.status(500).json({ message: "Error updating customer information" });
  } finally {
    connection.release();
  }
};

export const handleUpdateCustomerAddress = async (req, res, connection) => {
  const { id } = req.params; // address id (Primary Key for the address)
  const {
    address_line,
    country,
    region,
    province,
    city,
    postal_code,
    latitude,
    longitude,
  } = req.body;

  try {
    await connection.beginTransaction();

    // Update the customer address details
    const updateQuery = `
      UPDATE Addresses
      SET 
        address_line = ?,
        country = ?,
        region = ?,
        province = ?,
        city = ?,
        postal_code = ?,
        latitude = ?,
        longitude = ?,
        updated_at = NOW()
      WHERE id = ?;  
    `;

    await connection.execute(updateQuery, [
      address_line,
      country,
      region,
      province,
      city,
      postal_code,
      latitude,
      longitude,
      id,
    ]);

    await connection.commit();

    res.status(200).json({
      success: true,
      message: "Your address has been successfully updated!",
    });
  } catch (error) {
    await connection.rollback();
    console.error("Database operation error:", error);
    res.status(500).json({ message: "Error updating customer address" });
  } finally {
    connection.release();
  }
};

export const handleUpdateResetPassword = async (req, res, connection) => {
  const { id } = req.params;
  const { currentPassword, password } = req.body;

  try {
    const [user] = await connection.execute(
      "SELECT password FROM User_Security WHERE user_id = ?",
      [id]
    );

    if (!user || user.length === 0) {
      return res.status(200).json({ message: "User not found." });
    }

    const isPasswordCorrect = await comparePassword(
      currentPassword,
      user[0].password
    );

    if (!isPasswordCorrect) {
      return res
        .status(200)
        .json({ message: "Current password is incorrect." });
    }

    const newPasswordHash = await hashPassword(password);

    await connection.execute(
      "UPDATE User_Security SET password = ?, password_salt = ? WHERE user_id = ?",
      [newPasswordHash, null, id]
    );

    res.status(200).json({
      success: true,
      message: "Password has been successfully updated!",
    });
  } catch (error) {
    console.error("Error in resetting password:", error);
    res
      .status(500)
      .json({ message: "An error occurred while updating password." });
  } finally {
    connection.release();
  }
};

export const handleUpdateChangeStore = async (req, res, connection) => {
  const { id } = req.params;
  const { store_id } = req.body;

  try {
    await connection.beginTransaction();

    const checkCurrentStoreQuery = `
       SELECT store_id
       FROM User_Account
       WHERE id = ?;
     `;
    const [currentStoreResult] = await connection.execute(
      checkCurrentStoreQuery,
      [id]
    );
    const currentStore = currentStoreResult[0]?.store_id;

    if (currentStore === store_id) {
      return res.status(200).json({
        success: false,
        message: "You are already assigned to this store.",
      });
    }

    const checkPendingAssignmentsQuery = `
      SELECT COUNT(*) AS pendingAssignments
      FROM Laundry_Assignment AS la
      JOIN Service_Request AS sr ON la.service_request_id = sr.id
      WHERE sr.user_id = ? AND la.isAssignmentStatus = 0;  -- Status 0 means In Progress
    `;
    const [pendingAssignmentsResult] = await connection.execute(
      checkPendingAssignmentsQuery,
      [id]
    );
    const { pendingAssignments } = pendingAssignmentsResult[0];

    const checkPendingTransactionsQuery = `
      SELECT COUNT(*) AS pendingTransactions
      FROM Transactions AS t
      JOIN Laundry_Assignment AS la ON t.assignment_id = la.id
      JOIN Service_Request AS sr ON la.service_request_id = sr.id
      WHERE sr.customer_id = ? AND t.status != 'Completed';
    `;
    const [pendingTransactionsResult] = await connection.execute(
      checkPendingTransactionsQuery,
      [id]
    );
    const { pendingTransactions } = pendingTransactionsResult[0];

    if (pendingAssignments > 0 || pendingTransactions > 0) {
      await connection.rollback();
      return res.status(200).json({
        success: false,
        message:
          "Cannot switch stores with unfinished services or transactions.",
      });
    }

    const updateQuery = `
      UPDATE User
      SET store_id = ?
      WHERE id = ?;
    `;
    await connection.execute(updateQuery, [store_id, id]);

    await connection.commit();

    res.status(200).json({
      success: true,
      message: "Your store has been successfully changed.",
    });
  } catch (error) {
    await connection.rollback();
    console.error("Database operation error:", error);
    res
      .status(500)
      .json({ message: "An error occurred while updating the store." });
  } finally {
    connection.release();
  }
};

export const handleUpdateServiceRequestCancelByCustomer = async (
  req,
  res,
  connection
) => {
  const { id } = req.params;

  try {
    await connection.beginTransaction();

    const updateQuery = `
      UPDATE Service_Request
      SET request_status = 'Canceled'
      WHERE id = ?;
    `;

    const [result] = await connection.execute(updateQuery, [id]);

    if (result.affectedRows === 0) {
      return res
        .status(200)
        .json({ success: false, message: "Failed to update request status." });
    }

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

// Update for verification
export const handleUpdateEmailForVerification = async (
  req,
  res,
  connection
) => {
  const { id } = req.params;
  const { email } = req.body;

  try {
    const emailCheckQuery = `
      SELECT COUNT(*) AS count
      FROM User_Account
      WHERE email = ? AND id != ?;
    `;
    const [emailCheckRows] = await connection.execute(emailCheckQuery, [
      email,
      id,
    ]);

    if (emailCheckRows[0].count > 0) {
      return res
        .status(200)
        .json({ message: "Email is already taken by another user." });
    }

    await connection.beginTransaction();

    const updateEmailQuery = `
      UPDATE User_Account
      SET email = ?
      WHERE id = ?;
    `;

    await connection.execute(updateEmailQuery, [email, id]);

    await connection.commit();

    res
      .status(200)
      .json({ success: true, message: "Email updated successfully!" });
  } catch (error) {
    await connection.rollback();
    console.error("Database operation error:", error);
    res.status(500).json({ message: "Error updating email" });
  } finally {
    connection.release();
  }
};

export const handleUpdateAccountVerified = async (req, res, connection) => {
  const { id } = req.params;

  try {
    await connection.beginTransaction();

    const updateQuery = `
      UPDATE User_Account
      SET isVerifiedEmail = 1
      WHERE id = ? AND user_type = 'Customer';
    `;

    const [rows] = await connection.execute(updateQuery, [id]);

    if (rows.affectedRows === 0) {
      return res
        .status(200)
        .json({ message: "User not found or not a customer." });
    }

    await connection.commit();

    res.status(200).json({
      success: true,
      message: "Your account is verified successfully!",
    });
  } catch (error) {
    await connection.rollback();
    console.error("Database operation error:", error);
    res
      .status(500)
      .json({ message: "Error updating email verification status." });
  } finally {
    // Release the connection
    connection.release();
  }
};

export const handleUpdateClearAllNotificationsByCustomer = async (
  req,
  res,
  connection
) => {
  const { id } = req.params;

  try {
    await connection.beginTransaction();

    const updateQuery = `
      UPDATE Notifications
      SET status = 'Read', read_at = NOW()
      WHERE user_id = ? AND status != 'Archived';
    `;

    const [rows] = await connection.execute(updateQuery, [id]);

    await connection.commit();

    // for (const userId in userSockets) {
    //   const userSocket = userSockets[userId];

    //   if (userSocket.userId === id && userSocket.userType == "Customer") {
    //     io.to(userSocket.socketId).emit("notificationsModuleForCustomer", {});
    //   }
    // }

    res
      .status(200)
      .json({ success: true, message: "All notifications marked as read" });
  } catch (error) {
    await connection.rollback();
    console.error("Database operation error:", error);
    res.status(500).json({ error: "Error updating notifications" });
  } finally {
    connection.release();
  }
};

export const handleUpdateClearOneByOneNotificationsByCustomer = async (
  req,
  res,
  connection,
  io,
  userSockets
) => {
  const { id } = req.params;

  try {
    await connection.beginTransaction();

    const fetchUserIdQuery = `
      SELECT user_id 
      FROM Notifications 
      WHERE id = ? AND status != 'Archived';
    `;
    const [rows] = await connection.execute(fetchUserIdQuery, [id]);

    if (rows.length === 0) {
      await connection.rollback();
      return res
        .status(200)
        .json({ error: "Notification not found or already updated." });
    }

    const customerId = rows[0].user_id;

    const updateQuery = `
      UPDATE Notifications
      SET status = 'Read', read_at = NOW()
      WHERE id = ? AND status != 'Archived';
    `;

    const [result] = await connection.execute(updateQuery, [id]);

    if (result.affectedRows === 0) {
      await connection.rollback();
      return res
        .status(404)
        .json({ error: "Notification not found or already updated." });
    }

    await connection.commit();

    // for (const userId in userSockets) {
    //   const userSocket = userSockets[userId];

    //   console.log(userSocket);

    //   if (
    //     userSocket.userId === customerId &&
    //     userSocket.userType === "Customer"
    //   ) {
    //     io.to(userSocket.socketId).emit("notificationsModuleForCustomer", {
    //       notificationId: id,
    //       status: "Read",
    //     });
    //   }
    // }

    res
      .status(200)
      .json({ success: true, message: "Notification marked as read." });
  } catch (error) {
    await connection.rollback();
    console.error("Database operation error:", error);
    res.status(500).json({ error: "Error updating notification." });
  } finally {
    connection.release();
  }
};
