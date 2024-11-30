import { ActionDescriptions, ActionTypes } from "../../helpers/activityLog.js";
import { logActivity } from "../useExtraSystem.js";

export const handleCreateStore = async (req, res, connection) => {
  const {
    activity_id,
    activity_username,
    activity_roleName,
    store_no,
    store_name,
    store_contact,
    store_email,
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

    const [existingStoreNo] = await connection.execute(
      "SELECT * FROM Stores WHERE store_no = ?",
      [store_no]
    );
    if (existingStoreNo.length > 0) {
      return res.status(200).json({
        success: false,
        message_store_no: "Store No. already exists, please generate again",
      });
    }

    const [existingStoreName] = await connection.execute(
      "SELECT * FROM Stores WHERE store_name = ?",
      [store_name]
    );
    if (existingStoreName.length > 0) {
      return res.status(200).json({
        success: false,
        message_store_name: "Store name already exists",
      });
    }

    const [addressResult] = await connection.execute(
      `INSERT INTO Addresses (address_line, country, province, city, postal_code, latitude, longitude, updated_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, NOW())`,
      [address_line, country, province, city, postal_code, latitude, longitude]
    );

    const address_id = addressResult.insertId;

    const [result] = await connection.execute(
      `INSERT INTO Stores (address_id, store_no, store_name, store_contact, store_email, is_main_store, updated_at, date_created, isStatus, isArchive)
         VALUES (?, ?, ?, ?, ?, 0, NOW(), NOW(), 1, 0)`,
      [address_id, store_no, store_name, store_contact, store_email]
    );

    const newStoreId = result.insertId;

    // Insert the store into the Stores table with the address_id
    await connection.execute(
      `INSERT INTO Service_Type (store_id, service_name, default_price, date_created, isArchive)
       VALUES (?, 'Wash', 65, NOW(), FALSE),
              (?, 'Dry', 60, NOW(), FALSE),
              (?, 'Fold', 30, NOW(), FALSE),
              (?, 'Wash/Dry', 125, NOW(), FALSE),
              (?, 'Wash/Dry/Fold', 155, NOW(), FALSE)`,
      [newStoreId, newStoreId, newStoreId, newStoreId, newStoreId]
    );

    const actionType = ActionTypes.STORE_MANAGEMENT;
    const actionDescription = ActionDescriptions[actionType].ADD_STORE(
      activity_username,
      store_name
    );

    await logActivity(
      connection,
      activity_id,
      activity_roleName,
      actionType,
      actionDescription
    );

    await connection.commit();

    res.status(201).json({
      success: true,
      message: "Store created successfully",
    });
  } catch (error) {
    await connection.rollback();
    console.error("Error creating new store:", error);
    res.status(500).json({ success: false, message: "Server error" });
  } finally {
    if (connection) connection.release();
  }
};

export const handleViewStore = async (req, res, connection) => {
  try {
    const [rows] = await connection.query(
      `SELECT s.id, s.address_id, s.store_no, s.store_name, s.store_contact, 
              s.store_email, s.is_main_store, s.updated_at AS store_updated_at, 
              s.date_created, s.isStatus, s.isArchive, 
              a.address_line, a.country, a.province, a.city, a.postal_code, 
              a.latitude, a.longitude, a.updated_at AS address_updated_at
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

export const handleViewStoreByAdmin = async (req, res, connection) => {
  try {
    await connection.beginTransaction();

    const query = `
      WITH StoreInfo AS (
        SELECT 
          s.id AS store_id,
          s.store_no,
          s.store_name,
          s.store_contact,
          s.store_email,
          s.date_created,
          a.address_line,
          a.country,
          a.region,
          a.province,
          a.city,
          a.postal_code,
          a.latitude,
          a.longitude
        FROM 
          Stores s
        JOIN 
          Addresses a ON s.address_id = a.id
        WHERE 
          s.isStatus = 1 AND s.isArchive = 0
      ),
      RequestCounts AS (
        SELECT 
          sr.store_id,
          SUM(CASE WHEN sr.customer_type = 'Online' THEN 1 ELSE 0 END) AS online_count,
          SUM(CASE WHEN sr.customer_type = 'Walk-in' THEN 1 ELSE 0 END) AS walkin_count
        FROM 
          Service_Request sr
        JOIN 
          StoreInfo si ON sr.store_id = si.store_id
        GROUP BY 
          sr.store_id
      ),
      Sales AS (
        SELECT 
          s.id AS store_id,
          SUM(t.total_amount) AS total_sales
        FROM 
          Transactions t
        JOIN 
          Laundry_Assignment la ON t.assignment_id = la.id
        JOIN 
          Service_Request sr ON la.service_request_id = sr.id
        JOIN 
          Stores s ON sr.store_id = s.id
        WHERE 
          s.isStatus = 1 AND s.isArchive = 0
        GROUP BY 
          s.id
      ),
      Ratings AS (
        SELECT 
          fr.store_id,
          AVG(fr.rating) AS average_rating
        FROM 
          Feedback_Review fr
        JOIN 
          StoreInfo si ON fr.store_id = si.store_id
        WHERE 
          fr.is_approved = 1
        GROUP BY 
          fr.store_id
      ),
      ManagerInfo AS (
        SELECT 
          ua.store_id,
          CONCAT(ua.first_name, ' ', ua.last_name) AS manager_name,
          ua.date_created,
          ROW_NUMBER() OVER (PARTITION BY ua.store_id ORDER BY ua.date_created) AS row_num
        FROM 
          User_Account ua
        WHERE 
          ua.user_type IN ('Manager', 'Administrator') 
          AND ua.isArchive = 0
      )

      SELECT 
        si.*,
        COALESCE(rc.online_count, 0) AS online_count,  -- Count of online customers
        COALESCE(rc.walkin_count, 0) AS walkin_count,  -- Count of walk-in customers
        sa.total_sales,
        COALESCE(r.average_rating, 0) AS average_rating, -- Return 0 if no ratings exist
        COALESCE(mi.manager_name, 'N/A') AS manager_name -- Return 'N/A' if no manager exists
      FROM 
        StoreInfo si
      LEFT JOIN 
        RequestCounts rc ON si.store_id = rc.store_id
      LEFT JOIN 
        Sales sa ON si.store_id = sa.store_id
      LEFT JOIN 
        Ratings r ON si.store_id = r.store_id
      LEFT JOIN 
        ManagerInfo mi ON si.store_id = mi.store_id AND mi.row_num = 1; -- Only get the first created manager
    `;

    const [rows] = await connection.execute(query);

    await connection.commit(); // Commit the transaction

    res.status(200).json({
      success: true,
      data: rows,
    });
  } catch (error) {
    console.error("Error retrieving store list:", error);
    await connection.rollback(); // Rollback the transaction on error
    res.status(500).json({
      success: false,
      message: "An error occurred while retrieving the store list.",
    });
  }
};

export const handleUpdateStore = async (req, res, connection) => {
  const { id } = req.params;
  const {
    activity_id,
    activity_username,
    activity_roleName,
    store_no,
    store_name,
    store_contact,
    store_email,
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

    const [existingStoreNo] = await connection.execute(
      "SELECT * FROM Stores WHERE store_no = ? AND id != ?",
      [store_no, id]
    );
    if (existingStoreNo.length > 0) {
      return res.status(200).json({
        success: false,
        message: "Store No. already exists. Please choose a different number.",
      });
    }

    const [existingStoreName] = await connection.execute(
      "SELECT * FROM Stores WHERE store_name = ? AND id != ?",
      [store_name, id]
    );
    if (existingStoreName.length > 0) {
      return res.status(200).json({
        success: false,
        message: "Store name already exists. Please choose a different name.",
      });
    }

    const [addressResult] = await connection.execute(
      `UPDATE Addresses
       SET address_line = ?, country = ?, province = ?, city = ?, postal_code = ?, latitude = ?, longitude = ?, updated_at = NOW()
       WHERE id = (SELECT address_id FROM Stores WHERE id = ?)`,
      [
        address_line,
        country,
        province,
        city,
        postal_code,
        latitude,
        longitude,
        id,
      ]
    );

    if (addressResult.affectedRows === 0) {
      return res.status(400).json({
        success: false,
        message: "Address update failed. Please ensure the store exists.",
      });
    }

    const [result] = await connection.execute(
      `UPDATE Stores
       SET store_no = ?, store_name = ?, store_contact = ?, store_email = ?, updated_at = NOW()
       WHERE id = ?`,
      [store_no, store_name, store_contact, store_email, id]
    );

    if (result.affectedRows === 0) {
      return res.status(400).json({
        success: false,
        message: "Store update failed. Please ensure the store exists.",
      });
    }

    const actionType = ActionTypes.STORE_MANAGEMENT;
    const actionDescription = ActionDescriptions[actionType].UPDATE_STORE(
      activity_username,
      store_name
    );

    await logActivity(
      connection,
      activity_id,
      activity_roleName,
      actionType,
      actionDescription
    );

    await connection.commit();

    res.status(200).json({
      success: true,
      message: "Store updated successfully.",
    });
  } catch (error) {
    await connection.rollback();
    console.error("Error updating store:", error);
    res.status(500).json({
      success: false,
      message:
        "An error occurred while updating the store. Please try again later.",
    });
  } finally {
    if (connection) connection.release();
  }
};
