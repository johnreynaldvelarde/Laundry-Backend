export const handleSetServicesPromo = async (req, res, connection) => {
  const { service_id, discount_price, valid_days, start_date, end_date } =
    req.body;

  try {
    await connection.beginTransaction();

    const validDaysString = valid_days.join(", ");

    const query = `
      INSERT INTO Service_Promo (service_id, discount_price, valid_days, start_date, end_date, isActive, date_created, isArchive)
      VALUES (?, ?, ?, ?, ?, ?, NOW(), ?)
    `;

    const isArchive = false;

    const values = [
      service_id,
      discount_price,
      validDaysString, // Use the string version of valid_days
      start_date || null, // Handle optional start_date
      end_date || null, // Handle optional end_date
      true, // isActive
      isArchive, // isArchive
    ];

    const [rows] = await connection.execute(query, values);

    await connection.commit();

    res.status(200).json({
      success: true,
      message: "Promotion created successfully",
      data: rows,
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

export const handleGetServiceTypeList = async (req, res, connection) => {
  const { id } = req.params;

  try {
    await connection.beginTransaction();

    const query = `
      SELECT 
        st.id,
        st.store_id,
        st.service_name,
        st.description,
        st.isArchive,
        st.date_created,
        sp.discount_price,
        sp.valid_days,
        CASE 
            WHEN sp.isActive = 1 THEN 'active'
            WHEN sp.isActive = 0 THEN 'inactive' 
            ELSE null 
        END AS promo_status,
        st.default_price  -- Include default_price from Service_Type
      FROM Service_Type AS st
      LEFT JOIN Service_Promo AS sp ON st.id = sp.service_id AND sp.isArchive = 0
      WHERE st.store_id = ? AND st.isArchive = 0;
    `;

    const [rows] = await connection.execute(query, [id]);

    await connection.commit();

    res.status(200).json({
      success: true,
      data: rows, // Return the retrieved service type data
    });
  } catch (error) {
    await connection.rollback(); // Rollback in case of an error
    console.error("Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const handleGetServicePromoList = async (req, res, connection) => {
  const { id } = req.params; // store id

  try {
    await connection.beginTransaction();

    const query = `
      SELECT 
        sp.id AS promo_id,
        sp.service_id,
        sp.discount_price,
        sp.valid_days,
        sp.start_date,
        sp.end_date,
        CASE 
            WHEN sp.isActive = 1 THEN 'active'
            ELSE 'inactive' 
        END AS promo_status,
        st.service_name,
        st.default_price
      FROM Service_Promo AS sp
      INNER JOIN Service_Type AS st ON sp.service_id = st.id
      WHERE st.store_id = ? AND sp.isArchive = 0;
    `;

    const [rows] = await connection.execute(query, [id]);

    await connection.commit();

    res.status(200).json({
      success: true,
      data: rows, // Return the retrieved service promo data
    });
  } catch (error) {
    await connection.rollback(); // Rollback in case of an error
    console.error("Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const handleUpdatePromo = async (req, res, connection) => {
  const { id } = req.params; // promo_id
  const { discount_price, valid_days, start_date, end_date } = req.body;

  try {
    await connection.beginTransaction();

    const validDaysString = Array.isArray(valid_days)
      ? valid_days.join(", ")
      : valid_days;

    const updateQuery = `
      UPDATE Service_Promo
      SET 
        discount_price = ?, 
        valid_days = ?, 
        start_date = IFNULL(?, NULL), 
        end_date = IFNULL(?, NULL)
      WHERE id = ?`;

    await connection.execute(updateQuery, [
      discount_price,
      validDaysString,
      start_date || null,
      end_date || null,
      id,
    ]);

    await connection.commit();

    res.status(200).json({
      success: true,
      message: "Promo updated successfully",
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

export const handleUpdateDeactivatePromo = async (req, res, connection) => {
  const { id } = req.params; // promo id

  try {
    await connection.beginTransaction();

    const updateQuery = `
      UPDATE Service_Promo
      SET isActive = 0
      WHERE id = ?`;

    await connection.execute(updateQuery, [id]);

    await connection.commit();

    res.status(200).json({
      success: true,
      message: "Promo deactivated successfully",
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

export const handleUpdateActivatedPromo = async (req, res, connection) => {
  const { id } = req.params;

  try {
    await connection.beginTransaction();

    const updateQuery = `
      UPDATE Service_Promo
      SET isActive = 1
      WHERE id = ?`;

    await connection.execute(updateQuery, [id]);

    await connection.commit();

    res.status(200).json({
      success: true,
      message: "Promo activated successfully", // Success message
    });
  } catch (error) {
    await connection.rollback(); // Rollback in case of an error
    console.error("Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const handleUpdateServiceDelete = async (req, res, connection) => {
  const { id } = req.params; // service_id

  try {
    await connection.beginTransaction();

    const checkServiceRequestQuery = `
      SELECT COUNT(*) as requestCount
      FROM Service_Request
      WHERE service_type_id = ? 
      AND request_status NOT IN ('Canceled', 'Completed Delivery')`;

    const [requestRows] = await connection.execute(checkServiceRequestQuery, [
      id,
    ]);
    const requestCount = requestRows[0].requestCount;

    if (requestCount > 0) {
      return res.status(200).json({
        success: false,
        message: "Cannot archive the service type as it is currently in use.",
      });
    }

    const updateServiceTypeQuery = `
      UPDATE Service_Type
      SET isArchive = 1
      WHERE id = ?`;

    await connection.execute(updateServiceTypeQuery, [id]);

    const updateServicePromoQuery = `
      UPDATE Service_Promo
      SET isArchive = 1
      WHERE service_id = ?`;

    await connection.execute(updateServicePromoQuery, [id]);

    await connection.commit();

    res.status(200).json({
      success: true,
      message: "Service and associated promos archived successfully",
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
