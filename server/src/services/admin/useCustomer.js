import { generatePasswordSalt, hashPassword } from "../../helpers/auth.js";

export const handleRegisterCustomerModule = async (req, res, db) => {
  const {
    store_id,
    firstname,
    middlename,
    lastname,
    username,
    password,
    isAgreement,
    email,
    mobile_number,

    address_line,
    country,
    province,
    city,
    postal_code,
    latitude,
    longitude,
  } = req.body;

  try {
    // Check for existing username
    const [existingUser] = await db.execute(
      `
      SELECT * FROM User_Account 
      WHERE username = ? 
      LIMIT 1
      `,
      [username]
    );

    if (existingUser.length > 0) {
      return res
        .status(200)
        .json({ success: false, message: "Username already exists" });
    }

    const hashedPassword = await hashPassword(password);
    const passwordSalt = await generatePasswordSalt();

    await db.beginTransaction();

    const [addressResult] = await db.execute(
      `
      INSERT INTO Addresses 
      (address_line, country, province, city, postal_code, latitude, longitude, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, NOW())
      `,
      [address_line, country, province, city, postal_code, latitude, longitude]
    );

    const addressId = addressResult.insertId;

    const [customerResult] = await db.execute(
      `
      INSERT INTO User_Account 
      (store_id, address_id, username, email, mobile_number, first_name, middle_name, last_name, user_type, isAgreement, isOnline, isStatus, isArchive, date_created)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
      `,
      [
        store_id,
        addressId,
        username,
        email,
        mobile_number,
        firstname,
        middlename,
        lastname,
        "Customer",
        isAgreement,
        false,
        0,
        false,
      ]
    );

    const userId = customerResult.insertId;

    const [securityResult] = await db.execute(
      `
      INSERT INTO User_Security
      (user_id, password, password_salt, mfa_enabled, mfa_secret, failed_login_attempts, account_locked, lockout_time, last_login, last_logout, last_password_change)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        userId,
        hashedPassword,
        passwordSalt,
        false,
        null,
        0,
        false,
        null,
        null,
        null,
        null,
      ]
    );

    await db.commit();

    res.status(201).json({
      success: true,
      message: "Customer registered successfully",
    });
  } catch (error) {
    await db.rollback();
    console.error("Error registering customer:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  } finally {
    if (db) db.release();
  }
};

export const handleCustomerServiceRequest = async (req, res, connection) => {
  const { id } = req.params;
  const { store_id, customer_name, notes, service_type } = req.body;

  if (!store_id || !customer_name || !service_type) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const [result] = await connection.execute(
      `INSERT INTO Service_Request (
        store_id,
        user_id,  -- Assuming you want to assign the delivery person later
        customer_id,
        customer_fullname,
        notes,
        service_type,
        request_date,
        request_status
      ) VALUES (?, ?, ?, ?, ?, ?, NOW(), ?)`,
      [store_id, null, id, customer_name, notes, service_type, "In Queue"]
    );

    // 'Pending Pickup'

    // Get the ID of the newly created service request
    const newRequestId = result.insertId;

    // Respond with the created service request ID and success message
    res.status(201).json({
      message: "Service request created successfully",
      service_request_id: newRequestId,
    });
  } catch (error) {
    console.error("Error creating service request:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const handleGetCustomerList = async (req, res, connection) => {
  const { id } = req.params;

  try {
    await connection.beginTransaction();

    const query = `
      SELECT 
        ua.id AS customer_id,
        ua.username,
        ua.email,
        ua.mobile_number,
        ua.first_name,
        ua.middle_name,
        ua.last_name,
        ua.date_created,
        a.address_line,
        a.country,
        a.region,
        a.province,
        a.city,
        a.postal_code,
        a.latitude,
        a.longitude
      FROM 
        User_Account ua
      LEFT JOIN 
        Addresses a ON ua.address_id = a.id
      WHERE 
        ua.store_id = ? AND ua.user_type = 'Customer' AND ua.isArchive = 0
    `;

    const [rows] = await connection.execute(query, [id]);

    await connection.commit();

    if (rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No customers found." });
    }

    const customers = rows.map((row) => {
      const fullName = [row.first_name, row.middle_name, row.last_name]
        .filter(Boolean)
        .join(" ");
      return {
        customer_id: row.customer_id,
        username: row.username,
        email: row.email,
        mobile_number: row.mobile_number,
        full_name: fullName,
        date_created: row.date_created,
        address: {
          address_line: row.address_line,
          country: row.country,
          region: row.region,
          province: row.province,
          city: row.city,
          postal_code: row.postal_code,
          latitude: row.latitude,
          longitude: row.longitude,
        },
      };
    });

    res.status(200).json({
      success: true,
      data: customers,
    });
  } catch (error) {
    await connection.rollback();
    console.error("Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const handleGetCustomerGrowthOverTime = async (req, res, connection) => {
  const { id } = req.params; // store id

  try {
    await connection.beginTransaction();

    const query = `
      SELECT 
          DATE_FORMAT(date_created, '%Y-%m') AS date, 
          COUNT(*) AS count
      FROM 
          User_Account
      WHERE 
          store_id = ? AND 
          address_id IS NOT NULL AND 
          user_type = 'Customer' AND 
          isArchive = 0
      GROUP BY 
          date
      ORDER BY 
          date;
    `;

    const [rows] = await connection.execute(query, [id]);

    await connection.commit();

    // Respond with the aggregated customer growth data
    res.status(200).json({
      success: true,
      data: rows, // Send the aggregated data as part of the response
    });
  } catch (error) {
    await connection.rollback();
    console.error("Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
