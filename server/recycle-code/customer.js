import QRCode from "qrcode";
import { generateTrackingCode } from "../../helpers/generateCode.js";
import { progress } from "../../helpers/_progress.js";
// POST
export const handleSetCustomerServiceRequest = async (req, res, connection) => {
  const { id } = req.params; // Customer ID
  const { store_id, service_type_id, customer_name, notes, payment_method } =
    req.body;

  const missingFields = [];
  if (!store_id) missingFields.push("store_id");
  if (!customer_name) missingFields.push("customer_name");
  if (!service_type_id) missingFields.push("service_type_id");

  if (missingFields.length > 0) {
    return res.status(400).json({
      error: "Missing required fields",
      fields: missingFields,
    });
  }

  try {
    await connection.beginTransaction();

    const countQuery = `
      SELECT COUNT(*) AS request_count 
      FROM Service_Request 
      WHERE customer_id = ? 
        AND customer_type = 'Online'
        AND request_status != 'Canceled' 
        AND request_status != 'Completed Delivery';
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
          qr_code_generated,
          payment_method
        ) 
      VALUES (?, ?, ?, ?, ?, ?, NOW(), ?, ?, ?, ?)`;

    const [result] = await connection.execute(query, [
      store_id,
      id,
      service_type_id,
      customer_name,
      "Online",
      notes,
      "Pending Pickup",
      trackingCode,
      0,
      payment_method,
    ]);

    // Get the ID of the newly created service request
    const newRequestId = result.insertId;

    // Generate a unique QR code based on the service request ID
    const qrCodeData = `SR-${newRequestId}-${trackingCode}`; // Unique string for QR code (e.g., Service Request ID and timestamp)

    const qrCodeString = await QRCode.toDataURL(qrCodeData);

    // Update the Service_Request table with the generated QR code
    const updateQuery = `
      UPDATE Service_Request 
      SET qr_code = ?, qr_code_generated = 1
      WHERE id = ?`;

    await connection.execute(updateQuery, [qrCodeData, newRequestId]);

    // Insert initial progress entry into Service_Progress table
    const progressQuery = `
      INSERT INTO Service_Progress (
          service_request_id,
          stage,
          description,
          status_date,
          completed,
          false_description
        ) 
      VALUES (?, ?, ?, ?, ?, ?)`;

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

    await connection.commit();

    res.status(201).json({
      success: true,
      message: "Service request created!",
      service_request_id: newRequestId,
      qr_code: qrCodeData,
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
  const { sender_id, receiver_id, message } = req.body; // Extract necessary data from the request body

  try {
    // Begin transaction
    await connection.beginTransaction();

    // Check if a conversation already exists
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

// GET
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
        ) AS unread_messages
      FROM 
        Service_Request sr
      LEFT JOIN 
        Service_Progress sp ON sr.id = sp.service_request_id
      LEFT JOIN 
        User_Account ua ON sr.user_id = ua.id
      LEFT JOIN 
        Service_Type st ON sr.service_type_id = st.id
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
    for (const serviceRequest of result) {
      const { assignment_id } = serviceRequest.service_request;

      if (assignment_id !== "Waiting for total amount...") {
        const amountQuery = `
          SELECT 
            la.id AS laundry_assignment_id,
            sr.id AS service_request_id,
            st.default_price,
            la.weight,
            (st.default_price * la.weight) AS base_total_amount,
            sp.discount_percentage,
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
            AND (sp.isActive = 1 OR sp.id IS NULL)
            AND (sp.start_date IS NULL OR CURRENT_DATE BETWEEN sp.start_date AND sp.end_date)
          GROUP BY la.id;
        `;

        const [amountRows] = await connection.execute(amountQuery, [
          assignment_id,
        ]);

        if (amountRows.length > 0) {
          const {
            base_total_amount,
            discount_percentage,
            discount_price,
            valid_days,
            isActive,
            total_related_items,
          } = amountRows[0];

          let final_total = parseFloat(base_total_amount);
          let discount_applied = null;

          if (
            isActive &&
            valid_days &&
            valid_days.includes(
              new Date().toLocaleString("en-US", { weekday: "long" })
            )
          ) {
            if (discount_percentage > 0) {
              const discount_amount = final_total * (discount_percentage / 100);
              final_total -= discount_amount;
              discount_applied = {
                type: "percentage",
                value: discount_percentage,
                amount: discount_amount,
              };
            } else if (discount_price > 0) {
              final_total -= parseFloat(discount_price);
              discount_applied = {
                type: "price",
                value: discount_price,
                amount: discount_price,
              };
            }
          }

          final_total += parseFloat(total_related_items || 0);
          serviceRequest.total_amount = final_total; // Store the final total amount
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

export const handleGetCalculatedTransactionForCustomer = async (
  req,
  res,
  connection
) => {
  const { id } = req.params;

  try {
    await connection.beginTransaction();

    // Updated query to get all data in one row
    const query = `
      SELECT 
        la.id AS laundry_assignment_id,
        sr.id AS service_request_id,
        st.default_price,
        la.weight,
        (st.default_price * la.weight) AS base_total_amount,
        sp.discount_percentage,
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
        AND (sp.isActive = 1 OR sp.id IS NULL)
        AND (sp.start_date IS NULL OR CURRENT_DATE BETWEEN sp.start_date AND sp.end_date)
      GROUP BY la.id;
    `;

    const [rows] = await connection.execute(query, [id]);

    if (rows.length > 0) {
      const {
        weight,
        base_total_amount,
        discount_percentage,
        discount_price,
        valid_days,
        isActive,
        item_ids,
        item_prices,
        item_names,
        quantities,
        related_item_totals,
        total_related_items,
      } = rows[0];

      let final_total = parseFloat(base_total_amount);
      let discount_applied = null;

      console.log(
        `Base Total Amount (Service Price * Weight): ${base_total_amount}`
      );

      // Apply promo if active
      if (
        isActive &&
        valid_days &&
        valid_days.includes(
          new Date().toLocaleString("en-US", { weekday: "long" })
        )
      ) {
        if (discount_percentage > 0) {
          console.log(`Promo Active: ${discount_percentage}% Discount Applied`);
          const discount_amount = final_total * (discount_percentage / 100);
          final_total -= discount_amount;
          console.log(`Discount Amount: -${discount_amount}`);
          discount_applied = {
            type: "percentage",
            value: discount_percentage,
            amount: discount_amount,
          };
        } else if (discount_price > 0) {
          console.log(`Promo Active: ${discount_price} Price Discount Applied`);
          final_total -= parseFloat(discount_price);
          console.log(`Discount Amount: -${discount_price}`);
          discount_applied = {
            type: "price",
            value: discount_price,
            amount: discount_price,
          };
        }
      } else {
        console.log("No valid promo applied.");
      }

      final_total += parseFloat(total_related_items || 0);

      const itemIdsArray = item_ids ? item_ids.split(", ") : [];
      const itemNamesArray = item_ids ? item_names.split(", ") : [];
      const itemPricesArray = item_prices ? item_prices.split(", ") : [];
      const quantitiesArray = quantities ? quantities.split(", ") : [];
      const relatedItemTotalsArray = related_item_totals
        ? related_item_totals.split(", ")
        : [];

      res.status(200).json({
        success: true,
        data: {
          base_total_amount,
          weight: weight,
          discount_applied,
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

//#PUT
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
