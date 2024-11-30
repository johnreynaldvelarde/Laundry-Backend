import {
  generateTrackingCode,
  generateTransactionId,
} from "../../helpers/generateCode.js";
import { progress } from "../../helpers/_progress.js";
const newPickupDate = new Date();

//#POST
export const handleCreateUnits = async (req, res, db) => {
  const { store_id, unit_name, isUnitStatus } = req.body;

  try {
    await db.beginTransaction();

    const [store] = await db.execute(
      "SELECT id FROM Stores WHERE id = ? LIMIT 1",
      [store_id]
    );

    if (store.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "Store not found" });
    }

    const validStatuses = [0, 1, 2, 3];
    if (!validStatuses.includes(isUnitStatus)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid unit status" });
    }

    const [unitExists] = await db.execute(
      "SELECT * FROM Laundry_Unit WHERE store_id = ? AND unit_name = ? LIMIT 1",
      [store_id, unit_name]
    );

    if (unitExists.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Unit name already exists in this store",
      });
    }

    await db.execute(
      "INSERT INTO Laundry_Unit (store_id, unit_name, isUnitStatus, date_created, isArchive) VALUES (?, ?, ?, NOW(), ?)",
      [store_id, unit_name, isUnitStatus, false]
    );

    await db.commit();

    res.status(201).json({
      success: true,
      message: "Laundry unit created successfully",
    });
  } catch (error) {
    console.error("Error creating laundry units:", error);
    await db.rollback();
    res.status(500).json({ success: false, message: "Server error" });
  }
};

//# CREATE NEW TRANSACTION
export const handleTypeOnlineTransaction = async (req, res, connection) => {
  const {
    store_id,
    assignment_id,
    transaction_code,
    total_amount,
    payment_method,
  } = req.body;

  try {
    await connection.beginTransaction();

    const insertQuery = `
      INSERT INTO Transactions (store_id, assignment_id, transaction_code, total_amount, payment_method, status, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())
    `;

    await connection.execute(insertQuery, [
      store_id,
      assignment_id,
      transaction_code,
      total_amount,
      payment_method,
      "Pending",
    ]);

    await connection.execute(
      `UPDATE Laundry_Assignment
      SET isAssignmentStatus = 1
      WHERE id = ?`,
      [assignment_id]
    );

    const [assignment] = await connection.execute(
      `SELECT unit_id, service_request_id FROM Laundry_Assignment WHERE id = ?`,
      [assignment_id]
    );

    const unitId = assignment[0].unit_id;
    const serviceRequestId = assignment[0].service_request_id;

    await connection.execute(
      `UPDATE Laundry_Unit
      SET isUnitStatus = 0
      WHERE id = ?`,
      [unitId]
    );

    await connection.execute(
      `UPDATE Service_Request 
       SET request_status = "Ready for Delivery"
       WHERE id = ?`,
      [serviceRequestId]
    );

    await connection.execute(
      `UPDATE Service_Progress
       SET completed = true,
           status_date = NOW()
       WHERE service_request_id = ? AND (stage = 'Laundry Completed' OR stage = 'Ready for Delivery')`,
      [serviceRequestId]
    );

    await connection.commit();

    res.status(201).json({
      success: true,
      message: "Transaction created with pending status.",
    });
  } catch (error) {
    await connection.rollback();
    res.status(500).json({
      success: false,
      message: "An error occurred while creating the transaction.",
    });
  } finally {
    connection.release();
  }
};

export const handleTypeWalkInTransaction = async (req, res, connection) => {
  const {
    store_id,
    assignment_id,
    transaction_code,
    total_amount,
    payment_method,
  } = req.body;

  try {
    await connection.beginTransaction();

    const insertQuery = `
      INSERT INTO Transactions (store_id, assignment_id, transaction_code, total_amount, payment_method, status, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())
    `;

    await connection.execute(insertQuery, [
      store_id,
      assignment_id,
      transaction_code,
      total_amount,
      payment_method,
      "Completed",
    ]);

    await connection.execute(
      `UPDATE Laundry_Assignment
      SET isAssignmentStatus = 1
      WHERE id = ?`,
      [assignment_id]
    );

    const [assignment] = await connection.execute(
      `SELECT unit_id, service_request_id FROM Laundry_Assignment WHERE id = ?`,
      [assignment_id]
    );

    const unitId = assignment[0].unit_id;
    const serviceRequestId = assignment[0].service_request_id;

    await connection.execute(
      `UPDATE Laundry_Unit
      SET isUnitStatus = 0
      WHERE id = ?`,
      [unitId]
    );

    await connection.execute(
      `UPDATE Service_Request 
       SET payment_method = ?, request_status = "Laundry Completed" 
       WHERE id = ?`,
      [payment_method, serviceRequestId]
    );

    await connection.execute(
      `UPDATE Service_Progress
       SET completed = true,
           status_date = NOW()
       WHERE service_request_id = ? AND (stage = 'Laundry Completed' OR stage = 'Ready for Delivery')`,
      [serviceRequestId]
    );

    await connection.commit();

    res.status(201).json({
      success: true,
      message: "Transaction created with pending status.",
    });
  } catch (error) {
    await connection.rollback();
    res.status(500).json({
      success: false,
      message: "An error occurred while creating the transaction.",
    });
  } finally {
    connection.release();
  }
};

export const handleSetWalkInRequest = async (req, res, connection) => {
  const { id } = req.params;
  const {
    customerId,
    userId,
    serviceId,
    unitId,
    fullname,
    weight,
    customerNotes,
    supplies,
  } = req.body;

  try {
    await connection.beginTransaction();

    const trackingCode = generateTrackingCode();

    // Step 1: Insert into Service_Request
    const serviceRequestQuery = `
      INSERT INTO Service_Request (
        store_id,
        user_id,
        customer_id,
        service_type_id,
        customer_fullname,
        notes,
        request_date,
        request_status,
        tracking_code,
        customer_type,
        isPickup
      ) VALUES (?, ?, ?, ?, ?, ?, NOW(), 'In Laundry', ?, 'Walk-In', ?)
    `;

    const [serviceRequestResult] = await connection.execute(
      serviceRequestQuery,
      [
        id,
        userId,
        customerId,
        serviceId,
        fullname,
        customerNotes,
        trackingCode,
        1,
      ]
    );

    const serviceRequestId = serviceRequestResult.insertId;

    await connection.execute(
      `UPDATE Service_Request
        SET pickup_date = ?
        WHERE id = ?`,
      [newPickupDate, serviceRequestId]
    );

    const qrCodeData = `SR-${serviceRequestId}-${trackingCode}`;

    await connection.execute(
      `UPDATE Service_Request 
       SET qr_code = ?, qr_code_generated = 1
       WHERE id = ?`,
      [qrCodeData, serviceRequestId]
    );

    // Step 2: Insert the progress of new service
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
        serviceRequestId,
        item.stage,
        item.description,
        item.completed ? new Date() : null,
        item.completed,
        item.falseDescription,
      ]);
    }

    // Step 3: After step 2 update the existing progress
    await connection.execute(
      `UPDATE Service_Progress 
       SET completed = true,
           status_date = NOW()
       WHERE service_request_id = ? AND (stage = 'Ongoing Pickup' OR stage = 'Completed Pickup')`,
      [serviceRequestId]
    );

    // Step 4: Insert into Laundry_Assignment
    const assignmentQuery = `
      INSERT INTO Laundry_Assignment (
        service_request_id,
        unit_id,
        assigned_by,
        weight,
        assigned_at,
        isAssignmentStatus
      ) VALUES (?, ?, ?, ?, NOW(), 0)
    `;

    const [result] = await connection.execute(assignmentQuery, [
      serviceRequestId,
      unitId,
      userId,
      weight,
    ]);

    const assignmentId = result.insertId;

    // Step 5: Update Laundry_Unit's isUnitStatus to 1 (Occupied)
    const updateUnitQuery = `
      UPDATE Laundry_Unit 
      SET isUnitStatus = 1 
      WHERE id = ?
    `;

    await connection.execute(updateUnitQuery, [unitId]);

    // Step 6: check the supplies if have item
    if (supplies && supplies.length > 0) {
      for (const supply of supplies) {
        const { supplyId, quantity, amount } = supply;

        const relatedItemQuery = `
          INSERT INTO Related_Item (
            assignment_id,
            inventory_id,
            quantity,
            amount
          )
          VALUES (?, ?, ?, ?)
        `;
        await connection.execute(relatedItemQuery, [
          assignmentId,
          supplyId,
          quantity,
          amount,
        ]);

        // Update the quantity in the Inventory table
        const updateInventoryQuery = `
          UPDATE Inventory
          SET quantity = quantity - ?
          WHERE id = ?
        `;
        await connection.execute(updateInventoryQuery, [quantity, supplyId]);
      }
    }

    // Step 7: After step 6  update the existing progress
    await connection.execute(
      `UPDATE Service_Progress 
         SET completed = true,
             status_date = NOW()
         WHERE service_request_id = ? AND (stage = 'At Store' OR stage = 'In Queue' OR stage = 'In Laundry')`,
      [serviceRequestId]
    );

    // Commit the transaction
    await connection.commit();

    res
      .status(200)
      .json({ success: true, message: "Assignment created successfully." });
  } catch (error) {
    await connection.rollback();
    console.error(error);
    res.status(500).json({
      error: "An error occurred while setting the laundry assignment.",
    });
  }
};

// Set Laundry Assignment
export const handleSetLaundryAssignment = async (req, res, connection) => {
  const { service_request_id, unit_id, assign_by_id, weight, supplies } =
    req.body;

  console.log(req.body);
  try {
    await connection.beginTransaction();

    const insertQuery = `
      INSERT INTO Laundry_Assignment (
        service_request_id,
        unit_id,
        assigned_by,
        weight,
        assigned_at,
        isAssignmentStatus,
        isCompleted
      )
      VALUES (?, ?, ?, ?, NOW(), 0, 0)
    `;

    const [insertResults] = await connection.execute(insertQuery, [
      service_request_id,
      unit_id,
      assign_by_id,
      weight,
    ]);

    const assignmentId = insertResults.insertId;

    // Update Laundry Unit
    const updateQuery = `
      UPDATE Laundry_Unit
      SET isUnitStatus = 1
      WHERE id = ?
    `;
    await connection.execute(updateQuery, [unit_id]);

    // Update the Service_Request
    const updateRequestQuery = `
      UPDATE Service_Request
      SET request_status = 'In Laundry'
      WHERE id = ?
    `;
    await connection.execute(updateRequestQuery, [service_request_id]);

    // Check if supplies have data
    if (supplies && supplies.length > 0) {
      for (const supply of supplies) {
        const { supplyId, quantity, amount } = supply;

        const relatedItemQuery = `
          INSERT INTO Related_Item (
            assignment_id,
            inventory_id,
            quantity,
            amount
          )
          VALUES (?, ?, ?, ?)
        `;
        await connection.execute(relatedItemQuery, [
          assignmentId,
          supplyId,
          quantity,
          amount,
        ]);

        // Update the quantity in the Inventory table
        const updateInventoryQuery = `
          UPDATE Inventory
          SET quantity = quantity - ?
          WHERE id = ?
        `;
        await connection.execute(updateInventoryQuery, [quantity, supplyId]);
      }
    }

    await connection.execute(
      `UPDATE Service_Progress 
       SET completed = true,
           status_date = NOW()
       WHERE service_request_id = ? AND (stage = 'In Laundry')`,
      [service_request_id]
    );

    await connection.commit();

    res.status(200).json({
      success: true,
      message: "Laundry assignment successful",
      data: insertResults,
    });
  } catch (error) {
    await connection.rollback();
    console.error("Error setting laundry assignment:", error);
    res.status(500).json({
      error: "An error occurred while setting the laundry assignment.",
    });
  }
};

//#GET
export const handleGetServiceType = async (req, res, connection) => {
  const { id } = req.params;
  try {
    await connection.beginTransaction();

    const query = `
      SELECT 
        id, 
        service_name,
        default_price 
      FROM 
        Service_Type
      WHERE 
        store_id = ? AND isArchive = '0'
    `;

    const [results] = await connection.execute(query, [id]);
    await connection.commit();
    res.status(200).json({ data: results });
  } catch (error) {
    await connection.rollback();
    console.error("Error fetching service type:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching service type." });
  }
};

// Get Service In Queue
export const handleGetServiceInQueue = async (req, res, connection) => {
  const { id } = req.params;

  try {
    await connection.beginTransaction();

    const query = `
        SELECT 
          sr.id, 
          sr.store_id, 
          sr.user_id, 
          sr.customer_id, 
          sr.customer_fullname,
          sr.notes, 
          sr.service_type_id, 
          sr.request_date, 
          sr.pickup_date, 
          sr.delivery_date, 
          sr.request_status,
          st.service_name
        FROM 
          Service_Request sr
        JOIN 
          Service_Type st ON sr.service_type_id = st.id
        WHERE 
          sr.store_id = ? AND sr.request_status = 'Completed Pickup'
      `;

    const [rows] = await connection.execute(query, [id]);

    await connection.commit();

    res.status(200).json({ success: true, data: rows });
  } catch (error) {
    await connection.rollback();
    console.error("Error fetching customer requests:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching customer requests." });
  }
};

// Get unit list that only available only
export const handleGetUnitListAvaiable = async (req, res, connection) => {
  const { id } = req.params;

  try {
    await connection.beginTransaction();

    const query = `
    SELECT 
      id,
      unit_name 
    FROM 
      Laundry_Unit
    WHERE 
      store_id = ? 
      AND isUnitStatus = '0'
      AND isArchive = '0'
  `;

    const [results] = await connection.execute(query, [id]);

    await connection.commit();

    res.status(200).json({ data: results });
  } catch (error) {
    await connection.rollback();
    console.error("Error fetching laundry Unit:", error);
    res.status(500).json({ error: "An error occurred while fetching." });
  }
};

export const handleGetLaundryAssignments = async (req, res, connection) => {
  const { id } = req.params;

  try {
    await connection.beginTransaction();

    const query = `
      SELECT
        la.id,
        sr.customer_fullname,
        sr.customer_type,
        sr.payment_method,
        st.service_name,
        st.default_price,
        lu.unit_name,
        la.assigned_at
      FROM Laundry_Assignment la
      JOIN Service_Request sr ON la.service_request_id = sr.id
      JOIN Service_Type st ON sr.service_type_id = st.id
      JOIN Laundry_Unit lu ON la.unit_id = lu.id
      WHERE sr.store_id = ? 
        AND la.isAssignmentStatus = 0 
        AND la.isCompleted = 0
    `;

    const [rows] = await connection.execute(query, [id]);

    await connection.commit();

    res.status(200).json({ success: true, data: rows });
  } catch (error) {
    await connection.rollback();
    console.error("Error fetching assignments:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching assignments." });
  }
};

export const handleGetSelectedCustomer = async (req, res, connection) => {
  const { id } = req.params;

  try {
    await connection.beginTransaction();
    const query = `
      SELECT 
        id,
        CONCAT(first_name, ' ', middle_name, ' ', last_name) AS fullname,
        username,
        date_created
      FROM User_Account
      WHERE store_id = ? AND isArchive = 0 AND user_type = 'Customer'
      ORDER BY date_created DESC
    `;

    const [results] = await connection.execute(query, [id]);

    await connection.commit();

    res.status(200).json({ data: results });
  } catch (error) {
    await connection.rollback();
    res
      .status(500)
      .json({ error: "An error occurred while fetching the customer list." });
  }
};

export const handleViewUnits = async (req, res, db) => {
  const { store_id } = req.query;
  try {
    if (!store_id) {
      return res.status(400).json({
        success: false,
        message: "Store ID is required",
      });
    }

    const [rows] = await db.query(
      "SELECT id, unit_name, isUnitStatus, date_created, isArchive FROM Laundry_Unit WHERE store_id = ? AND isArchive = 0",
      [store_id]
    );

    res.status(200).json({
      success: true,
      data: rows,
    });
  } catch (error) {
    console.error("Error retrieving unit list:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while retrieving the unit list.",
    });
  }
};

export const handleGetCountRequestInQueue = async (req, res, connection) => {
  const { id } = req.params; // Store ID to filter requests

  try {
    await connection.beginTransaction();

    const query = `
      SELECT COUNT(*) AS count
      FROM Service_Request
      WHERE store_id = ? AND request_status = 'Completed Pickup'
    `;

    const [results] = await connection.execute(query, [id]);

    await connection.commit();

    res.status(200).json({
      data: results[0].count,
    });
  } catch (error) {
    await connection.rollback();
    console.error("Error getting count of requests in queue:", error);
    res.status(500).json({ error: "Failed to get request count" });
  }
};

export const handleGetCountLaundryAssignment = async (req, res, connection) => {
  const { id } = req.params;
  try {
    await connection.beginTransaction();

    const query = `
      SELECT 
        SUM(CASE WHEN la.isAssignmentStatus = '0' THEN 1 ELSE 0 END) AS count_in_progress,
        SUM(CASE WHEN la.isAssignmentStatus = '1' THEN 1 ELSE 0 END) AS count_completed,
        SUM(CASE WHEN la.isAssignmentStatus = '2' THEN 1 ELSE 0 END) AS count_canceled
      FROM Laundry_Assignment AS la
      INNER JOIN Service_Request AS sr ON la.service_request_id = sr.id
      WHERE sr.store_id = ?
    `;

    const [results] = await connection.execute(query, [id]);

    await connection.commit();

    res.status(200).json({
      data: {
        count_in_progress: results[0].count_in_progress,
        count_completed: results[0].count_completed,
        count_canceled: results[0].count_canceled,
      },
    });
  } catch (error) {
    await connection.rollback();
    console.error("Error getting count of assignments:", error);
    res.status(500).json({ error: "Failed to get assignment count" });
  }
};

export const handleGetInventoryLaundryItem = async (req, res, connection) => {
  const { id } = req.params;

  try {
    await connection.beginTransaction();

    const query = `
      SELECT 
        i.id AS inventory_id,
        it.item_name,
        i.quantity,
        i.price,
        i.isStatus
      FROM Inventory i
      INNER JOIN Item it ON i.item_id = it.id
      WHERE i.store_id = ?
        AND i.quantity > 0
        AND i.isStatus = 1
    `;

    const [results] = await connection.execute(query, [id]);

    await connection.commit();

    res.status(200).json({
      data: results,
    });
  } catch (error) {
    await connection.rollback();
    console.error("Error getting inventory items:", error);
    res.status(500).json({ error: "Failed to get inventory items" });
  }
};

//# ITS ABOUT GETTING THE CALCULATED TRANSACTION
// export const handleGetCalculatedTransaction = async (req, res, connection) => {
//   const { id } = req.params; // Laundry_Assignment ID

//   try {
//     await connection.beginTransaction();

//     const transactionId = generateTransactionId();

//     // Updated query to get all data in one row
//     const query = `
//       SELECT
//         la.id AS laundry_assignment_id,
//         sr.id AS service_request_id,
//         st.default_price,
//         la.weight,
//         (st.default_price * la.weight) AS base_total_amount,
//         sp.discount_percentage,
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

//     const [rows] = await connection.execute(query, [id]);

//     if (rows.length > 0) {
//       const {
//         weight,
//         base_total_amount,
//         discount_percentage,
//         discount_price,
//         valid_days,
//         isActive,
//         item_ids,
//         item_prices,
//         item_names,
//         quantities,
//         related_item_totals,
//         total_related_items,
//       } = rows[0];

//       let final_total = parseFloat(base_total_amount);
//       let discount_applied = null;

//       console.log(
//         `Base Total Amount (Service Price * Weight): ${base_total_amount}`
//       );

//       // Apply promo if active
//       if (
//         isActive &&
//         valid_days &&
//         valid_days.includes(
//           new Date().toLocaleString("en-US", { weekday: "long" })
//         )
//       ) {
//         if (discount_percentage > 0) {
//           console.log(`Promo Active: ${discount_percentage}% Discount Applied`);
//           const discount_amount = final_total * (discount_percentage / 100);
//           final_total -= discount_amount;
//           console.log(`Discount Amount: -${discount_amount}`);
//           discount_applied = {
//             type: "percentage",
//             value: discount_percentage,
//             amount: discount_amount,
//           };
//         } else if (discount_price > 0) {
//           console.log(`Promo Active: ${discount_price} Price Discount Applied`);
//           final_total -= parseFloat(discount_price);
//           console.log(`Discount Amount: -${discount_price}`);
//           discount_applied = {
//             type: "price",
//             value: discount_price,
//             amount: discount_price,
//           };
//         }
//       } else {
//         console.log("No valid promo applied.");
//       }

//       final_total += parseFloat(total_related_items || 0);

//       const itemIdsArray = item_ids ? item_ids.split(", ") : [];
//       const itemNamesArray = item_ids ? item_names.split(", ") : [];
//       const itemPricesArray = item_prices ? item_prices.split(", ") : [];
//       const quantitiesArray = quantities ? quantities.split(", ") : [];
//       const relatedItemTotalsArray = related_item_totals
//         ? related_item_totals.split(", ")
//         : [];

//       res.status(200).json({
//         success: true,
//         data: {
//           transaction_id: transactionId,
//           base_total_amount,
//           weight: weight,
//           discount_applied,
//           related_items: {
//             item_ids: itemIdsArray,
//             item_prices: itemPricesArray,
//             item_names: itemNamesArray,
//             quantities: quantitiesArray,
//             related_item_totals: relatedItemTotalsArray,
//           },
//           total_related_items: total_related_items || 0,
//           final_total: final_total.toFixed(2),
//         },
//       });
//     } else {
//       console.log("No valid data found or no active promo.");
//       res.status(404).json({
//         success: false,
//         message: "No valid data found or no active promo.",
//       });
//     }

//     await connection.commit();
//   } catch (error) {
//     await connection.rollback();
//     console.error("Error fetching assignment:", error);
//     res.status(500).json({
//       success: false,
//       error: "An error occurred while fetching the assignment.",
//     });
//   } finally {
//     connection.release();
//   }
// };

export const handleGetCalculatedTransaction = async (req, res, connection) => {
  const { id } = req.params;

  try {
    await connection.beginTransaction();

    const transactionId = generateTransactionId();

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
          transaction_id: transactionId,
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

//#PUT
export const handleUpdateProgressInqueueAndAtStore = async (
  req,
  res,
  connection
) => {
  const { id } = req.params;
  try {
    await connection.beginTransaction();

    const [rows] = await connection.execute(
      `SELECT completed FROM Service_Progress 
       WHERE service_request_id = ? AND (stage = 'At Store' OR stage = 'In Queue')`,
      [id]
    );

    if (rows.length > 0 && rows.every((row) => row.completed === true)) {
      await connection.rollback();
      return;
    }
    await connection.execute(
      `UPDATE Service_Progress 
       SET completed = true,
           status_date = NOW()
       WHERE service_request_id = ? AND completed = false AND (stage = 'At Store' OR stage = 'In Queue')`,
      [id]
    );

    await connection.commit();

    res.status(200).json({
      success: true,
    });
  } catch (error) {
    await connection.rollback();
    res.status(500).json({
      success: false,
      message: "Error updating service progress.",
      error,
    });
  }
};

export const handlePutAssignment = async (req, res, connection) => {
  const { id } = req.params;

  try {
    // Start the transaction
    await connection.beginTransaction();

    // Query to update Laundry_Assignment: Set isAssignmentStatus to 2 (Canceled)
    const updateAssignmentQuery = `
      UPDATE Laundry_Assignment
      SET isAssignmentStatus = 2
      WHERE id = ?
    `;
    await connection.query(updateAssignmentQuery, [id]);

    // Query to update Service_Request: Set request_status to 'Canceled'
    const updateServiceRequestQuery = `
      UPDATE Service_Request
      SET request_status = 'Canceled'
      WHERE id = (
        SELECT service_request_id
        FROM Laundry_Assignment
        WHERE id = ?
      )
    `;
    await connection.query(updateServiceRequestQuery, [id]);

    // Query to update Laundry_Unit: Set isUnitStatus to 0 (Available)
    const updateLaundryUnitQuery = `
      UPDATE Laundry_Unit
      SET isUnitStatus = 0
      WHERE id = (
        SELECT unit_id
        FROM Laundry_Assignment
        WHERE id = ?
      )
    `;
    await connection.query(updateLaundryUnitQuery, [id]);

    // Commit the transaction after successful updates
    await connection.commit();

    // Return success response
    res.status(200).json({
      message: "Assignment and related records updated successfully.",
    });
  } catch (error) {
    // Rollback the transaction in case of an error
    await connection.rollback();
    console.error("Error updating assignment: ", error);
    res.status(500).json({ error: "Failed to update assignment." });
  }
};

export const handlePutRemoveInQueue = async (req, res, connection) => {
  const { id } = req.params;
  try {
    await connection.beginTransaction();
    const query = `
      UPDATE Service_Request
      SET request_status = 'Canceled'
      WHERE id = ?;
    `;

    const [results] = await connection.execute(query, [id]);

    await connection.commit();

    res.status(200).json({ message: "Request canceled successfully" });
  } catch (error) {
    await connection.rollback();
    res
      .status(500)
      .json({ success: false, message: "Error canceling the request", error });
  }
};
