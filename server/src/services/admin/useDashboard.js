export const handleAdminGetTotalRevenue = async (req, res, connection) => {
  try {
    await connection.beginTransaction();

    const totalRevenueQuery = `
      SELECT
          SUM(total_amount) AS total_revenue
      FROM Transactions
      WHERE status = 'Completed'
        AND YEAR(created_at) = YEAR(CURRENT_DATE());
    `;

    const [totalRevenueRows] = await connection.execute(totalRevenueQuery);
    const totalRevenue =
      totalRevenueRows.length > 0
        ? parseFloat(totalRevenueRows[0]?.total_revenue) || 0
        : 0;

    const query = `
      SELECT
          MONTH(created_at) AS month,
          YEAR(created_at) AS year,
          SUM(total_amount) AS revenue
      FROM Transactions
      WHERE status = 'Completed' 
        AND created_at >= DATE_SUB(CURRENT_DATE(), INTERVAL 5 MONTH)
      GROUP BY YEAR(created_at), MONTH(created_at)
      ORDER BY YEAR(created_at) DESC, MONTH(created_at) DESC;
  `;

    const [monthlyRevenueRows] = await connection.execute(query);
    const currentMonth = new Date().getMonth();
    const months = [
      "JAN",
      "FEB",
      "MAR",
      "APR",
      "MAY",
      "JUN",
      "JUL",
      "AUG",
      "SEP",
      "OCT",
      "NOV",
      "DEC",
    ];

    const chartData = months
      .map((month, index) => {
        const monthData = monthlyRevenueRows.find(
          (row) => row.month === index + 1
        );
        return {
          name: month,
          value: monthData ? monthData.revenue : 0,
        };
      })
      .slice(currentMonth - 4, currentMonth + 1);

    const currentRevenue = chartData[4]?.value || 0;
    const previousRevenue = chartData[3]?.value || 0;

    const change =
      previousRevenue === 0
        ? currentRevenue === 0
          ? 0
          : 100
        : ((currentRevenue - previousRevenue) / previousRevenue) * 100;

    const cappedChange = change > 100 ? 100 : change;

    const formattedChange = `${
      cappedChange > 0 ? "+" : ""
    }${cappedChange.toFixed(2)}%`;
    const formattedTotalRevenue = `₱${totalRevenue.toLocaleString()}`;

    const data = {
      title: "Total Revenue",
      amount: formattedTotalRevenue,
      change: formattedChange,
      chart_data: chartData,
    };

    await connection.commit();

    res.status(200).json({
      success: true,
      data: data,
    });
  } catch (error) {
    console.error("Error:", error);
    await connection.rollback();
    res.status(500).json({
      success: false,
      message: "Failed to fetch total revenue data.",
    });
  }
};

export const handleAdminGetTotalLaundryOrders = async (
  req,
  res,
  connection
) => {
  try {
    await connection.beginTransaction();

    // Query for Total Laundry Orders for the Current Year
    const totalOrdersQuery = `
      SELECT
          COUNT(id) AS total_orders
      FROM Service_Request
      WHERE request_status IN ('Completed', 'Laundry Completed', 'Completed Delivery')
        AND YEAR(request_date) = YEAR(CURRENT_DATE());
    `;
    const [totalOrdersRows] = await connection.execute(totalOrdersQuery);
    const totalOrders =
      totalOrdersRows.length > 0 ? totalOrdersRows[0]?.total_orders || 0 : 0;

    // Query for Monthly Orders in the Last 5 Months
    const monthlyOrdersQuery = `
      SELECT
          MONTH(request_date) AS month,
          YEAR(request_date) AS year,
          COUNT(id) AS orders
      FROM Service_Request
      WHERE request_status IN ('Completed', 'Laundry Completed', 'Completed Delivery')
        AND request_date >= DATE_SUB(CURRENT_DATE(), INTERVAL 5 MONTH)
      GROUP BY YEAR(request_date), MONTH(request_date)
      ORDER BY YEAR(request_date) DESC, MONTH(request_date) DESC;
    `;

    const [monthlyOrdersRows] = await connection.execute(monthlyOrdersQuery);
    const currentMonth = new Date().getMonth();
    const months = [
      "JAN",
      "FEB",
      "MAR",
      "APR",
      "MAY",
      "JUN",
      "JUL",
      "AUG",
      "SEP",
      "OCT",
      "NOV",
      "DEC",
    ];

    // Formatting Chart Data for Last 5 Months
    const chartData = months
      .map((month, index) => {
        const monthData = monthlyOrdersRows.find(
          (row) => row.month === index + 1
        );
        return {
          name: month,
          value: monthData ? monthData.orders : 0,
        };
      })
      .slice(currentMonth - 4, currentMonth + 1);

    const currentOrders = chartData[4]?.value || 0;
    const previousOrders = chartData[3]?.value || 0;

    const change =
      previousOrders === 0
        ? currentOrders === 0
          ? 0
          : 100
        : ((currentOrders - previousOrders) / previousOrders) * 100;

    const cappedChange = change > 100 ? 100 : change;

    const formattedChange = `${
      cappedChange > 0 ? "+" : ""
    }${cappedChange.toFixed(2)}%`;
    const formattedTotalOrders = `${totalOrders.toLocaleString()}`;

    const data = {
      title_orders: "Total Laundry Orders",
      amount_orders: formattedTotalOrders,
      change_orders: formattedChange,
      chart_data_orders: chartData,
    };

    await connection.commit();

    res.status(200).json({
      success: true,
      data: data,
    });
  } catch (error) {
    console.error("Error:", error);
    await connection.rollback();
    res.status(500).json({
      success: false,
      message: "Failed to fetch total laundry orders data.",
    });
  }
};

export const handleAdminGetTotalCustomers = async (req, res, connection) => {
  try {
    await connection.beginTransaction();

    const totalCustomersQuery = `
      SELECT
          COUNT(id) AS total_customers
      FROM User_Account
      WHERE user_type = 'Customer'
        AND YEAR(date_created) = YEAR(CURRENT_DATE());
    `;
    const [totalCustomersRows] = await connection.execute(totalCustomersQuery);
    const totalCustomers =
      totalCustomersRows.length > 0
        ? totalCustomersRows[0]?.total_customers || 0
        : 0;

    const monthlyCustomersQuery = `
      SELECT
          MONTH(date_created) AS month,
          YEAR(date_created) AS year,
          COUNT(id) AS customers
      FROM User_Account
      WHERE user_type = 'Customer'
        AND date_created >= DATE_SUB(CURRENT_DATE(), INTERVAL 5 MONTH)
      GROUP BY YEAR(date_created), MONTH(date_created)
      ORDER BY YEAR(date_created) DESC, MONTH(date_created) DESC;
    `;

    const [monthlyCustomersRows] = await connection.execute(
      monthlyCustomersQuery
    );
    const currentMonth = new Date().getMonth();
    const months = [
      "JAN",
      "FEB",
      "MAR",
      "APR",
      "MAY",
      "JUN",
      "JUL",
      "AUG",
      "SEP",
      "OCT",
      "NOV",
      "DEC",
    ];

    const chartData = months
      .map((month, index) => {
        const monthData = monthlyCustomersRows.find(
          (row) => row.month === index + 1
        );
        return {
          name: month,
          value: monthData ? monthData.customers : 0,
        };
      })
      .slice(currentMonth - 4, currentMonth + 1);

    const currentCustomers = chartData[4]?.value || 0;
    const previousCustomers = chartData[3]?.value || 0;

    const change =
      previousCustomers === 0
        ? currentCustomers === 0
          ? 0
          : 100
        : ((currentCustomers - previousCustomers) / previousCustomers) * 100;

    const cappedChange = change > 100 ? 100 : change;

    const formattedChange = `${
      cappedChange > 0 ? "+" : ""
    }${cappedChange.toFixed(2)}%`;
    const formattedTotalCustomers = `${totalCustomers.toLocaleString()}`;

    const data = {
      title_customers: "Total Customers",
      amount_customers: formattedTotalCustomers,
      change_customers: formattedChange,
      chart_data_customers: chartData,
    };

    await connection.commit();

    res.status(200).json({
      success: true,
      data: data,
    });
  } catch (error) {
    console.error("Error:", error);
    await connection.rollback();
    res.status(500).json({
      success: false,
      message: "Failed to fetch total customers data.",
    });
  }
};

export const handleAdminGetTotalLaundryLoadProcess = async (
  req,
  res,
  connection
) => {
  try {
    await connection.beginTransaction();

    // Query for total assignments
    const totalAssignmentsQuery = `
      SELECT COUNT(id) AS total_assignments
      FROM Laundry_Assignment
      WHERE YEAR(assigned_at) = YEAR(CURRENT_DATE())
    `;
    const [totalAssignmentsRows] = await connection.execute(
      totalAssignmentsQuery
    );
    const totalAssignments = totalAssignmentsRows[0]?.total_assignments || 0;

    // Query for monthly assignment counts for the last 5 months
    const monthlyAssignmentsQuery = `
      SELECT
        MONTH(assigned_at) AS month,
        COUNT(id) AS assignments,
        SUM(CASE WHEN isAssignmentStatus = 1 THEN 1 ELSE 0 END) AS completed
      FROM Laundry_Assignment
      WHERE assigned_at >= DATE_SUB(CURRENT_DATE(), INTERVAL 5 MONTH)
      GROUP BY MONTH(assigned_at)
      ORDER BY MONTH(assigned_at) DESC
    `;
    const [monthlyAssignmentsRows] = await connection.execute(
      monthlyAssignmentsQuery
    );

    // Define month labels
    const currentMonth = new Date().getMonth();
    const months = [
      "JAN",
      "FEB",
      "MAR",
      "APR",
      "MAY",
      "JUN",
      "JUL",
      "AUG",
      "SEP",
      "OCT",
      "NOV",
      "DEC",
    ];

    // Prepare data for the chart
    const chartData = months
      .map((month, index) => {
        const monthData = monthlyAssignmentsRows.find(
          (row) => row.month === index + 1
        );
        return {
          name: month,
          value: monthData ? Number(monthData.assignments) : 0,
        };
      })
      .slice(currentMonth - 4, currentMonth + 1);

    // Calculate change in completed assignments from last month to current
    const currentCompleted = chartData[4]?.completed_assignments || 0;
    const previousCompleted = chartData[3]?.completed_assignments || 0;
    const change =
      previousCompleted === 0
        ? currentCompleted === 0
          ? 0
          : 100
        : ((currentCompleted - previousCompleted) / previousCompleted) * 100;
    const cappedChange = change > 100 ? 100 : change;
    const formattedChange = `${
      cappedChange > 0 ? "+" : ""
    }${cappedChange.toFixed(2)}%`;

    // Format total assignments count
    const formattedTotalAssignments = totalAssignments.toLocaleString();

    const data = {
      title_load: "Total Laundry Load Process",
      amount_load: formattedTotalAssignments,
      change_load: formattedChange,
      chart_data_load: chartData,
    };

    await connection.commit();

    res.status(200).json({
      success: true,
      data: data,
    });
  } catch (error) {
    console.error("Error:", error);
    await connection.rollback();
    res.status(500).json({
      success: false,
      message: "Failed to fetch laundry load process data.",
    });
  }
};

//#
export const handleAdminGetListCustomerMostServiceRequest = async (
  req,
  res,
  db
) => {
  try {
    await db.beginTransaction();

    // SQL query to fetch the top customers with the most service requests and their address line
    const query = `
      SELECT 
        u.id AS customer_id,
        u.first_name,
        u.middle_name,
        u.last_name,
        u.email,
        a.address_line,  -- Include address_line from Addresses table
        COUNT(sr.id) AS service_request_count
      FROM 
        User_Account u
      LEFT JOIN 
        Service_Request sr ON u.id = sr.customer_id
      LEFT JOIN 
        Addresses a ON u.address_id = a.id  -- Join with Addresses table to get address_line
      WHERE 
        u.user_type = 'Customer'
      GROUP BY 
        u.id
      ORDER BY 
        service_request_count DESC
    `;

    const [rows] = await db.execute(query);

    await db.commit();

    res.status(200).json({
      success: true,
      data: rows, // Send the data including the address_line
    });
  } catch (error) {
    await db.rollback();
    console.error(
      "Error fetching customers with most service requests:",
      error
    );
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const handleAdminGetRevenueByMonth = async (req, res, db) => {
  try {
    await db.beginTransaction();

    const query = `
      SELECT 
        MONTHNAME(created_at) AS month, 
        SUM(total_amount) AS revenue
      FROM Transactions
      WHERE status = 'Completed'
      GROUP BY MONTH(created_at)
      ORDER BY MONTH(created_at)
    `;

    // Execute the query
    const [rows] = await db.execute(query);

    await db.commit();

    // Format the data to match the required structure
    const monthlyRevenueData = rows.map((row) => ({
      month: row.month,
      revenue: row.revenue,
    }));

    res.status(200).json({
      success: true,
      data: monthlyRevenueData,
    });
  } catch (error) {
    // Rollback the transaction in case of an error
    await db.rollback();
    console.error("Error fetching revenue by month:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// WITH STORE ID
export const handleAdminGetTotalRevenueWithStoreId = async (
  req,
  res,
  connection
) => {
  const { id } = req.params; // store_id
  try {
    await connection.beginTransaction();

    const totalRevenueQuery = `
      SELECT
          SUM(total_amount) AS total_revenue
      FROM Transactions
      WHERE status = 'Completed'
        AND YEAR(created_at) = YEAR(CURRENT_DATE())
        AND store_id = ?;
    `;

    const [totalRevenueRows] = await connection.execute(totalRevenueQuery, [
      id,
    ]);
    const totalRevenue =
      totalRevenueRows.length > 0
        ? parseFloat(totalRevenueRows[0]?.total_revenue) || 0
        : 0;

    const query = `
      SELECT
          MONTH(created_at) AS month,
          YEAR(created_at) AS year,
          SUM(total_amount) AS revenue
      FROM Transactions
      WHERE status = 'Completed' 
        AND created_at >= DATE_SUB(CURRENT_DATE(), INTERVAL 5 MONTH)
        AND store_id = ?
      GROUP BY YEAR(created_at), MONTH(created_at)
      ORDER BY YEAR(created_at) DESC, MONTH(created_at) DESC;
  `;

    const [monthlyRevenueRows] = await connection.execute(query, [id]);
    const currentMonth = new Date().getMonth();
    const months = [
      "JAN",
      "FEB",
      "MAR",
      "APR",
      "MAY",
      "JUN",
      "JUL",
      "AUG",
      "SEP",
      "OCT",
      "NOV",
      "DEC",
    ];

    const chartData = months
      .map((month, index) => {
        const monthData = monthlyRevenueRows.find(
          (row) => row.month === index + 1
        );
        return {
          name: month,
          value: monthData ? monthData.revenue : 0,
        };
      })
      .slice(currentMonth - 4, currentMonth + 1);

    const currentRevenue = chartData[4]?.value || 0;
    const previousRevenue = chartData[3]?.value || 0;

    const change =
      previousRevenue === 0
        ? currentRevenue === 0
          ? 0
          : 100
        : ((currentRevenue - previousRevenue) / previousRevenue) * 100;

    const cappedChange = change > 100 ? 100 : change;

    const formattedChange = `${
      cappedChange > 0 ? "+" : ""
    }${cappedChange.toFixed(2)}%`;
    const formattedTotalRevenue = `₱${totalRevenue.toLocaleString()}`;

    const data = {
      title: "Total Revenue",
      amount: formattedTotalRevenue,
      change: formattedChange,
      chart_data: chartData,
    };

    await connection.commit();

    res.status(200).json({
      success: true,
      data: data,
    });
  } catch (error) {
    console.error("Error:", error);
    await connection.rollback();
    res.status(500).json({
      success: false,
      message: "Failed to fetch total revenue data.",
    });
  }
};

export const handleAdminGetTotalLaundryOrdersWithStoreId = async (
  req,
  res,
  connection
) => {
  const { id } = req.params; // store_id
  try {
    await connection.beginTransaction();

    const totalOrdersQuery = `
      SELECT
          COUNT(id) AS total_orders
      FROM Service_Request
      WHERE request_status IN ('Completed', 'Laundry Completed', 'Completed Delivery')
        AND YEAR(request_date) = YEAR(CURRENT_DATE())
        AND store_id = ?;
    `;
    const [totalOrdersRows] = await connection.execute(totalOrdersQuery, [id]);
    const totalOrders =
      totalOrdersRows.length > 0 ? totalOrdersRows[0]?.total_orders || 0 : 0;

    // Query for Monthly Orders in the Last 5 Months
    const monthlyOrdersQuery = `
      SELECT
          MONTH(request_date) AS month,
          YEAR(request_date) AS year,
          COUNT(id) AS orders
      FROM Service_Request
      WHERE request_status IN ('Completed', 'Laundry Completed', 'Completed Delivery')
        AND request_date >= DATE_SUB(CURRENT_DATE(), INTERVAL 5 MONTH)
         AND store_id = ?
      GROUP BY YEAR(request_date), MONTH(request_date)
      ORDER BY YEAR(request_date) DESC, MONTH(request_date) DESC;
    `;

    const [monthlyOrdersRows] = await connection.execute(monthlyOrdersQuery, [
      id,
    ]);
    const currentMonth = new Date().getMonth();
    const months = [
      "JAN",
      "FEB",
      "MAR",
      "APR",
      "MAY",
      "JUN",
      "JUL",
      "AUG",
      "SEP",
      "OCT",
      "NOV",
      "DEC",
    ];

    // Formatting Chart Data for Last 5 Months
    const chartData = months
      .map((month, index) => {
        const monthData = monthlyOrdersRows.find(
          (row) => row.month === index + 1
        );
        return {
          name: month,
          value: monthData ? monthData.orders : 0,
        };
      })
      .slice(currentMonth - 4, currentMonth + 1);

    const currentOrders = chartData[4]?.value || 0;
    const previousOrders = chartData[3]?.value || 0;

    const change =
      previousOrders === 0
        ? currentOrders === 0
          ? 0
          : 100
        : ((currentOrders - previousOrders) / previousOrders) * 100;

    const cappedChange = change > 100 ? 100 : change;

    const formattedChange = `${
      cappedChange > 0 ? "+" : ""
    }${cappedChange.toFixed(2)}%`;
    const formattedTotalOrders = `${totalOrders.toLocaleString()}`;

    const data = {
      title_orders: "Total Laundry Orders",
      amount_orders: formattedTotalOrders,
      change_orders: formattedChange,
      chart_data_orders: chartData,
    };

    await connection.commit();

    res.status(200).json({
      success: true,
      data: data,
    });
  } catch (error) {
    console.error("Error:", error);
    await connection.rollback();
    res.status(500).json({
      success: false,
      message: "Failed to fetch total laundry orders data.",
    });
  }
};

export const handleAdminGetTotalCustomersWithStoreId = async (
  req,
  res,
  connection
) => {
  const { id } = req.params; // store_id
  try {
    await connection.beginTransaction();

    const totalCustomersQuery = `
      SELECT
          COUNT(id) AS total_customers
      FROM User_Account
      WHERE user_type = 'Customer'
        AND YEAR(date_created) = YEAR(CURRENT_DATE())
        AND store_id = ?;
    `;
    const [totalCustomersRows] = await connection.execute(totalCustomersQuery, [
      id,
    ]);
    const totalCustomers =
      totalCustomersRows.length > 0
        ? totalCustomersRows[0]?.total_customers || 0
        : 0;

    const monthlyCustomersQuery = `
      SELECT
          MONTH(date_created) AS month,
          YEAR(date_created) AS year,
          COUNT(id) AS customers
      FROM User_Account
      WHERE user_type = 'Customer'
        AND date_created >= DATE_SUB(CURRENT_DATE(), INTERVAL 5 MONTH)
         AND store_id = ?
      GROUP BY YEAR(date_created), MONTH(date_created)
      ORDER BY YEAR(date_created) DESC, MONTH(date_created) DESC;
    `;

    const [monthlyCustomersRows] = await connection.execute(
      monthlyCustomersQuery,
      [id]
    );
    const currentMonth = new Date().getMonth();
    const months = [
      "JAN",
      "FEB",
      "MAR",
      "APR",
      "MAY",
      "JUN",
      "JUL",
      "AUG",
      "SEP",
      "OCT",
      "NOV",
      "DEC",
    ];

    const chartData = months
      .map((month, index) => {
        const monthData = monthlyCustomersRows.find(
          (row) => row.month === index + 1
        );
        return {
          name: month,
          value: monthData ? monthData.customers : 0,
        };
      })
      .slice(currentMonth - 4, currentMonth + 1);

    const currentCustomers = chartData[4]?.value || 0;
    const previousCustomers = chartData[3]?.value || 0;

    const change =
      previousCustomers === 0
        ? currentCustomers === 0
          ? 0
          : 100
        : ((currentCustomers - previousCustomers) / previousCustomers) * 100;

    const cappedChange = change > 100 ? 100 : change;

    const formattedChange = `${
      cappedChange > 0 ? "+" : ""
    }${cappedChange.toFixed(2)}%`;
    const formattedTotalCustomers = `${totalCustomers.toLocaleString()}`;

    const data = {
      title_customers: "Total Customers",
      amount_customers: formattedTotalCustomers,
      change_customers: formattedChange,
      chart_data_customers: chartData,
    };

    await connection.commit();

    res.status(200).json({
      success: true,
      data: data,
    });
  } catch (error) {
    console.error("Error:", error);
    await connection.rollback();
    res.status(500).json({
      success: false,
      message: "Failed to fetch total customers data.",
    });
  }
};

// GET LIST OF DELIVERY
export const handleUserGetListReadyForDelivery = async (
  req,
  res,
  connection
) => {
  const { id } = req.params;
  try {
    await connection.beginTransaction();

    // SQL Query to fetch Service Requests that are ready for delivery along with the customer address
    const query = `
        SELECT
          SR.id AS service_request_id,
          SR.tracking_code,
          SR.customer_fullname,
          SR.delivery_date,
          SR.request_status,
          SR.isDelivery,
          LA.id AS laundry_assignment_id,
          LA.assigned_at,
          T.id AS transaction_id,
          T.total_amount,
          T.payment_method,
          T.status AS transaction_status,
          T.created_at AS transaction_date,
          MAX(A.address_line) AS address_line,
          MAX(A.country) AS country,
          MAX(A.region) AS region,
          MAX(A.province) AS province,
          MAX(A.city) AS city,
          MAX(A.postal_code) AS postal_code
        FROM Service_Request SR
        LEFT JOIN Laundry_Assignment LA ON LA.service_request_id = SR.id
        LEFT JOIN Transactions T ON T.assignment_id = LA.id
        LEFT JOIN User_Account UA ON UA.store_id = SR.store_id AND UA.user_type = 'Customer'
        LEFT JOIN Addresses A ON A.id = UA.address_id
        WHERE SR.store_id = ?
          AND SR.request_status IN ('Ready for Delivery', 'Attempted Delivery')
          AND LA.isAssignmentStatus = 1
          AND (T.status = 'Completed' OR T.status = 'Pending')
        GROUP BY SR.id
         ORDER BY 
        CASE 
          WHEN SR.request_status = 'Attempted Delivery' THEN 1
          WHEN SR.request_status = 'Ready for Delivery' THEN 2
          ELSE 3
        END;
      `;

    const [readyForDeliveryRows] = await connection.execute(query, [id]);

    // Format and return the data
    const data = readyForDeliveryRows.map((row) => ({
      service_request_id: row.service_request_id,
      tracking_code: row.tracking_code,
      customer_fullname: row.customer_fullname,
      delivery_date: row.delivery_date,
      request_status: row.request_status,
      isDelivery: row.isDelivery,
      laundry_assignment_id: row.laundry_assignment_id,
      assigned_at: row.assigned_at,
      transaction_id: row.transaction_id,
      total_amount: row.total_amount,
      payment_method: row.payment_method,
      transaction_status: row.transaction_status,
      transaction_date: row.transaction_date,
      address_line: row.address_line,
      country: row.country,
      region: row.region,
      province: row.province,
      city: row.city,
      postal_code: row.postal_code,
    }));

    await connection.commit();

    res.status(200).json({
      success: true,
      data: data,
    });
  } catch (error) {
    console.error("Error:", error);
    await connection.rollback();
    res.status(500).json({
      success: false,
      message: "Failed to fetch Service Requests ready for delivery.",
    });
  }
};

export const handleAdminGetMapCustomerAndStore = async (
  req,
  res,
  connection
) => {
  try {
    await connection.beginTransaction();

    const customerQuery = `
      SELECT
        u.id AS user_id,
        CONCAT(u.first_name, ' ', IFNULL(u.middle_name, ''), ' ', u.last_name) AS full_name,
        a.latitude AS customer_latitude,
        a.longitude AS customer_longitude
      FROM User_Account u
      LEFT JOIN Addresses a ON u.address_id = a.id
      WHERE u.user_type = 'Customer'
        AND u.address_id IS NOT NULL
        AND u.isArchive = 0
    `;

    const [customerRows] = await connection.execute(customerQuery);

    const storeQuery = `
      SELECT
        s.id AS store_id,
        s.store_name,
        a.latitude AS store_latitude,
        a.longitude AS store_longitude
      FROM Stores s
      LEFT JOIN Addresses a ON s.address_id = a.id
      WHERE s.isArchive = 0
    `;

    const [storeRows] = await connection.execute(storeQuery);

    const rows = {
      customers: customerRows.map((row) => ({
        user_id: row.user_id,
        full_name: row.full_name,
        customer_latitude: row.customer_latitude,
        customer_longitude: row.customer_longitude,
      })),
      stores: storeRows.map((row) => ({
        store_id: row.store_id,
        store_name: row.store_name,
        store_latitude: row.store_latitude,
        store_longitude: row.store_longitude,
      })),
    };

    await connection.commit();

    res.status(200).json({
      success: true,
      data: rows, // Returning both customer and store data under `rows`
    });
  } catch (error) {
    console.error("Error:", error);
    await connection.rollback();
    res.status(500).json({
      success: false,
      message: "Failed to fetch customer and store data",
    });
  }
};

export const handleAdminGetListTopMostUseService = async (req, res, db) => {
  try {
    await db.beginTransaction();

    const query = `
      SELECT 
        st.service_name,
        COUNT(sr.id) AS request_count
      FROM 
        Service_Type st
      LEFT JOIN 
        Service_Request sr ON st.id = sr.service_type_id
      WHERE 
        st.isArchive = 0  
      GROUP BY 
        st.service_name
      ORDER BY 
        request_count DESC
    `;

    const [rows] = await db.execute(query);

    await db.commit();

    res.status(200).json({
      success: true,
      data: rows,
    });
  } catch (error) {
    await db.rollback();
    console.error("Error fetching most-used services:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
