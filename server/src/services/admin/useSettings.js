// <----- Service Type Section ----->
// Set new service type
export const handleSetNewServiceType = async (req, res, connection) => {
  const { store_id, service_name, default_price, description } = req.body;

  try {
    await connection.beginTransaction();

    const checkQuery = `
        SELECT id FROM Service_Type 
        WHERE store_id = ? AND service_name = ? AND isArchive = 0
      `;
    const [existingService] = await connection.query(checkQuery, [
      store_id,
      service_name,
    ]);

    if (existingService.length > 0) {
      return res
        .status(200)
        .json({ success: false, message: "Service name already exists." });
    }

    const insertQuery = `
        INSERT INTO Service_Type (store_id, service_name, description, default_price, date_created, isArchive)
        VALUES (?, ?, ?, ?, NOW(), 0)
      `;

    await connection.query(insertQuery, [
      store_id,
      service_name,
      description,
      default_price,
    ]);
    await connection.commit();
    res
      .status(200)
      .json({ success: true, message: "Service type created successfully." });
  } catch (error) {
    await connection.rollback();
    res
      .status(500)
      .json({ error: "An error occurred while creating the service type." });
  }
};

// Put the service type
export const handleUpdateServiceType = async (req, res, connection) => {
  const { id } = req.params;
  const { service_name, description, default_price } = req.body;
  try {
    await connection.beginTransaction();

    const updateQuery = `
      UPDATE Service_Type 
      SET service_name = ?, description = ?, default_price = ?
      WHERE id = ?
    `;

    await connection.query(updateQuery, [
      service_name,
      description,
      default_price,
      id,
    ]);
    await connection.commit();
    res
      .status(200)
      .json({ success: true, message: "Service type update successfully." });
  } catch (error) {
    await connection.rollback();
    res
      .status(500)
      .json({ error: "An error occurred while creating the service type." });
  }
};

// Delete the service type
export const handleDeleteServiceType = async (req, res, connection) => {
  const { id } = req.params;

  try {
    await connection.beginTransaction();
    const updateQuery = `
      UPDATE Service_Type 
      SET isArchive = 1
      WHERE id = ? 
    `;

    await connection.query(updateQuery, [id]);
    await connection.commit();
    res
      .status(200)
      .json({ success: true, message: "Service type delete successfully." });
  } catch (error) {
    await connection.rollback();
    res
      .status(500)
      .json({ error: "An error occurred while deleting the service type." });
  }
};

// Get the service type
export const handleGetServiceTypeAndStore = async (req, res, connection) => {
  const { id } = req.params;

  try {
    await connection.beginTransaction();

    const userQuery = `
      SELECT ua.store_id, rp.role_name
      FROM User_Account ua
      JOIN Roles_Permissions rp ON ua.role_permissions_id = rp.id
      WHERE ua.id = ? AND rp.role_name = 'Administrator'
  `;
    const [userResults] = await connection.execute(userQuery, [id]);

    if (userResults.length === 0) {
      await connection.rollback();
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }

    const { store_id, role_name } = userResults[0];

    if (role_name === "Administrator") {
      const storesQuery = "SELECT * FROM Stores WHERE isArchive = 0";
      const [stores] = await connection.execute(storesQuery);

      const storeIds = stores.map((store) => store.id);
      const serviceTypesQuery = `
        SELECT * FROM Service_Type 
        WHERE isArchive = 0 
        AND store_id IN (${storeIds.map((id) => `'${id}'`).join(",")})
      `;
      const [serviceTypes] = await connection.execute(serviceTypesQuery);

      await connection.commit();
      return res.json({
        success: true,
        stores,
        serviceTypes,
      });
    } else {
      const serviceTypesQuery =
        "SELECT * FROM Service_Type WHERE store_id = ? AND isArchive = 0";
      const [serviceTypes] = await connection.execute(serviceTypesQuery, [
        store_id,
      ]);

      await connection.commit();
      return res.json({
        success: true,
        serviceTypes,
      });
    }
  } catch (error) {
    await connection.rollback();
    console.error("Error fetching service types and stores:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching data.",
    });
  } finally {
    if (connection) connection.release();
  }
};

// export const handleGetServiceTypeAndStore = async (req, res, connection) => {
//   const { id } = req.params; // its based on user id of user

//   try {
//     await connection.beginTransaction();

//     const query = `

//     `;

//     const [results] = await connection.execute();

//     await connection.commit();

//     res.status(200).json(results);
//   } catch (error) {
//     await connection.rollback();
//     console.error(");
//     res
//       .status(500)
//       .json({ error: " });
//   }

// }

// Update the details of service type

// Delete the service type

// <----- ----- ----->

// export const handleSetNewServiceType = async (req, res, connection) => {
//     const {store_id, service_name, default_price,} = req.body;

//     try {
//       await connection.beginTransaction();

//       const query = `

//       `;

//       res.status(200).json({  });
//     } catch (error) {
//       await connection.rollback();
//       res.status(500).json({ error: "" });
//     }
//   };
