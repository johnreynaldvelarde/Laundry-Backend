export const handleGetTransactionHistory = async (req, res, db) => {
  const { id } = req.params; // Store ID

  //console.log(id); // Debugging: Check the store ID

  try {
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
          sr.customer_fullname,  -- Get the customer_fullname directly from Service_Request
          sr.customer_type,
          sr.customer_id,
          la.weight,
          ri.quantity AS related_item_quantity,
          ri.amount AS related_item_amount,
          i.item_name AS related_item_name,
          st.service_name,
          st.default_price
      FROM 
          Transactions t
      LEFT JOIN 
          Laundry_Assignment la ON la.id = t.assignment_id
      LEFT JOIN 
          Service_Request sr ON sr.id = la.service_request_id  -- Join Service_Request to get customer_fullname
      LEFT JOIN 
          Service_Type st ON st.id = sr.service_type_id
      LEFT JOIN 
          Related_Item ri ON ri.assignment_id = t.assignment_id
      LEFT JOIN 
          Inventory inv ON inv.id = ri.inventory_id
      LEFT JOIN 
          Item i ON i.id = inv.item_id
      WHERE 
          sr.store_id = ? 
          AND (i.isArchive = 0 OR i.isArchive IS NULL) 
      ORDER BY 
          t.created_at DESC;
    `;

    // Query the database
    const [rows] = await db.query(query, [id]);

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No transactions found for this store",
      });
    }

    // Transform the result to group related items under each transaction
    const transactions = rows.reduce((acc, row) => {
      let transaction = acc.find(
        (t) => t.transaction_id === row.transaction_id
      );

      // If the transaction doesn't exist, create a new one
      if (!transaction) {
        transaction = {
          transaction_id: row.transaction_id,
          customer_id: row.customer_id,
          assignment_id: row.assignment_id,
          transaction_code: row.transaction_code,
          total_amount: row.total_amount,
          payment_method: row.payment_method,
          transaction_status: row.transaction_status,
          created_at: row.created_at,
          updated_at: row.updated_at,
          customer_fullname: row.customer_fullname, // Use customer_fullname from Service_Request
          customer_type: row.customer_type,
          service_name: row.service_name,
          default_price: row.default_price,
          load: row.weight,
          related_items: [],
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

    // Send the grouped transaction data as the response
    res.status(200).json({
      success: true,
      data: transactions,
    });
  } catch (error) {
    console.error("Error fetching transaction history:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const handleGetTotalSalesByMonth = async (req, res, db) => {
  const { id } = req.params; // Store's id

  try {
    // Start a transaction
    await db.beginTransaction();

    // SQL query to get total sales by month, including months with zero sales
    const query = `
      SELECT 
        months.month,
        IFNULL(SUM(t.total_amount), 0) AS sales
      FROM 
        (SELECT 'Jan' AS month UNION SELECT 'Feb' UNION SELECT 'Mar' UNION 
         SELECT 'Apr' UNION SELECT 'May' UNION SELECT 'Jun' UNION 
         SELECT 'Jul' UNION SELECT 'Aug' UNION SELECT 'Sep' UNION 
         SELECT 'Oct' UNION SELECT 'Nov' UNION SELECT 'Dec') AS months
      LEFT JOIN 
        Transactions t ON DATE_FORMAT(t.created_at, '%b') = months.month 
        AND t.store_id = ?  -- Using store_id instead of assignment_id
      GROUP BY 
        months.month
      ORDER BY 
        FIELD(months.month, 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
              'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec');  -- Corrected closing parenthesis
    `;

    // Execute the query using the existing connection
    const [rows] = await db.execute(query, [id]);

    // Commit the transaction if successful
    await db.commit();

    // Format the result to match your desired structure
    const formattedData = rows.map((row) => ({
      month: row.month,
      sales: row.sales,
    }));

    res.status(200).json({
      success: true,
      data: formattedData, // Returning the formatted data
    });
  } catch (error) {
    // Rollback the transaction in case of an error
    await db.rollback();
    console.error("Error fetching total sales by month:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const handleGetCustomerTypeStats = async (req, res, db) => {
  const { id } = req.params;

  try {
    await db.beginTransaction();

    const query = `
      SELECT 
        sr.customer_type,
        COUNT(t.id) AS count
      FROM 
        Service_Request sr
      LEFT JOIN 
        Transactions t ON sr.id = t.assignment_id
      WHERE 
        sr.store_id = ?
        AND sr.customer_type IN ('Online', 'Walk-In') 
      GROUP BY 
        sr.customer_type
    `;

    const [rows] = await db.execute(query, [id]);

    console.log(rows);

    await db.commit();

    const customData = [
      { name: "Online", value: 0 },
      { name: "Walk-In", value: 0 },
    ];

    rows.forEach((row) => {
      if (row.customer_type === "Online") {
        customData[0].value = row.count;
      } else if (row.customer_type === "Walk-In") {
        customData[1].value = row.count;
      }
    });

    res.status(200).json({
      success: true,
      data: customData,
    });
  } catch (error) {
    await db.rollback();
    console.error("Err:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// export const handleGetTransactionHistory = async (req, res, db) => {
//   const { id } = req.params; // store id

//   try {

//     const query = `
//          SELECT
//             t.id AS transaction_id,
//             t.assignment_id,
//             t.transaction_code,
//             t.total_amount,
//             t.payment_method,
//             t.status AS transaction_status,
//             t.created_at,
//             t.updated_at,
//             sr.customer_fullname,  -- Customer's full name from Service_Request
//             sr.customer_type,
//             ri.quantity AS related_item_quantity,
//             ri.amount AS related_item_amount,
//             i.item_name AS related_item_name,
//             la.weight,  -- Laundry weight from Laundry_Assignment
//             st.service_name,
//             st.default_price
//         FROM
//             Transactions t
//         LEFT JOIN
//             Service_Request sr ON t.assignment_id = sr.id
//         LEFT JOIN
//             Laundry_Assignment la ON la.service_request_id = sr.id
//         LEFT JOIN
//             Service_Type st ON st.id = sr.service_type_id
//         LEFT JOIN
//             Related_Item ri ON ri.assignment_id = t.assignment_id
//         LEFT JOIN
//             Inventory inv ON inv.id = ri.inventory_id
//         LEFT JOIN
//             Item i ON i.id = inv.item_id
//         WHERE
//             sr.store_id = ?  -- Store ID filter
//             AND (i.isArchive = 0 OR i.isArchive IS NULL)  -- Inventory filter (excluding archived items)
//         ORDER BY
//             t.created_at DESC;  -- Order by transaction creation date
//       `;

//     const [rows] = await db.query(query, [id]);

//     console.log(rows);

//     // Transform the result to group related items under each transaction
//     const transactions = rows.reduce((acc, row) => {
//       // Find the existing transaction
//       let transaction = acc.find(
//         (t) => t.transaction_id === row.transaction_id
//       );

//       // If the transaction doesn't exist, create a new one
//       if (!transaction) {
//         transaction = {
//           transaction_id: row.transaction_id,
//           assignment_id: row.assignment_id,
//           transaction_code: row.transaction_code,
//           total_amount: row.total_amount,
//           payment_method: row.payment_method,
//           transaction_status: row.transaction_status,
//           created_at: row.created_at,
//           updated_at: row.updated_at,
//           customer_fullname: row.customer_fullname,
//           customer_type: row.customer_type,
//           service_name: row.service_name,
//           weight: row.weight,
//           default_price: row.default_price,
//           related_items: [],
//         };
//         acc.push(transaction);
//       }

//       // If there's a related item, add it to the transaction's related items array
//       if (row.related_item_name) {
//         transaction.related_items.push({
//           item_name: row.related_item_name,
//           quantity: row.related_item_quantity,
//           amount: row.related_item_amount,
//         });
//       }

//       return acc;
//     }, []);

//     res.status(200).json({
//       success: true,
//       data: transactions,
//     });
//   } catch (error) {
//     console.error("Error fetching transaction history:", error);
//     res.status(500).json({
//       success: false,
//       message: "Server error",
//     });
//   }
// };

// export const handleGetTransactionHistory = async (req, res, db) => {
//   const { id } = req.params; // Store ID

//   console.log(id);

//   try {
//     const query = `
//       SELECT
//           t.id AS transaction_id,
//           t.assignment_id,
//           t.transaction_code,
//           t.total_amount,
//           t.payment_method,
//           t.status AS transaction_status,
//           t.created_at,
//           t.updated_at,
//           CONCAT(ua.first_name, ' ', ua.middle_name, ' ', ua.last_name) AS customer_fullname,
//           sr.customer_type,
//           sr.customer_id,
//           ri.quantity AS related_item_quantity,
//           ri.amount AS related_item_amount,
//           i.item_name AS related_item_name,
//           st.service_name,
//           st.default_price
//       FROM
//           Transactions t
//       LEFT JOIN
//           Service_Request sr ON t.assignment_id = sr.id
//       LEFT JOIN
//           User_Account ua ON sr.customer_id = ua.id
//       LEFT JOIN
//           Laundry_Assignment la ON la.service_request_id = sr.id
//       LEFT JOIN
//           Service_Type st ON st.id = sr.service_type_id
//       LEFT JOIN
//           Related_Item ri ON ri.assignment_id = t.assignment_id
//       LEFT JOIN
//           Inventory inv ON inv.id = ri.inventory_id
//       LEFT JOIN
//           Item i ON i.id = inv.item_id
//       WHERE
//           sr.store_id = ?
//           AND (i.isArchive = 0 OR i.isArchive IS NULL)  -- Inventory filter (excluding archived items)
//       ORDER BY
//           t.created_at DESC;
//     `;

//     // Query the database
//     const [rows] = await db.query(query, [id]);

//     // console.log("Raw query result:", rows); // Debugging: Check the raw rows

//     // Transform the result to group related items under each transaction
//     const transactions = rows.reduce((acc, row) => {
//       let transaction = acc.find(
//         (t) => t.transaction_id === row.transaction_id
//       );

//       // If the transaction doesn't exist, create a new one
//       if (!transaction) {
//         transaction = {
//           transaction_id: row.transaction_id,
//           customer_id: row.customer_id,
//           assignment_id: row.assignment_id,
//           transaction_code: row.transaction_code,
//           total_amount: row.total_amount,
//           payment_method: row.payment_method,
//           transaction_status: row.transaction_status,
//           created_at: row.created_at,
//           updated_at: row.updated_at,
//           customer_fullname: row.customer_fullname,
//           customer_type: row.customer_type,
//           service_name: row.service_name,
//           default_price: row.default_price,
//           related_items: [],
//         };
//         acc.push(transaction);
//       }

//       // If there's a related item, add it to the transaction's related items array
//       if (row.related_item_name) {
//         transaction.related_items.push({
//           item_name: row.related_item_name,
//           quantity: row.related_item_quantity,
//           amount: row.related_item_amount,
//         });
//       }

//       return acc;
//     }, []);

//     // console.log("Grouped transactions:", transactions); // Debugging: Check grouped transactions

//     res.status(200).json({
//       success: true,
//       data: transactions,
//     });
//   } catch (error) {
//     console.error("Error fetching transaction history:", error);
//     res.status(500).json({
//       success: false,
//       message: "Server error",
//     });
//   }
// };
