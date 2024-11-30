export const handleAdminGetTotalRevenue = async (req, res, connection) => {
  try {
    await connection.beginTransaction();

    // Query to fetch total revenue for the entire current year
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

    // Query to fetch revenue for the last 5 months, including the current month
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
          (row) => row.month === index + 1 // Adjust for 1-based month number
        );
        return {
          name: month,
          value: monthData ? monthData.revenue : 0, // Use 0 for months with no revenue
        };
      })
      .slice(currentMonth - 4, currentMonth + 1); // Get the last 5 months, including the current month

    console.log("Chart Data:", chartData);

    const currentRevenue = chartData[4]?.value || 0;
    const previousRevenue = chartData[3]?.value || 0;

    console.log("Current Revenue:", currentRevenue);
    console.log("Previous Revenue:", previousRevenue);

    // Calculate change percentage
    const change =
      previousRevenue === 0
        ? currentRevenue === 0
          ? 0
          : 100 // If both are 0, no change, if previous is 0 but current is not, it's a 100% increase
        : ((currentRevenue - previousRevenue) / previousRevenue) * 100;

    // Format the change
    const formattedChange = `${change > 0 ? "+" : ""}${change.toFixed(2)}%`;
    const formattedTotalRevenue = `₱${totalRevenue.toLocaleString()}`;
    // Final data object
    const data = {
      title: "Total Revenue (Yearly)",
      amount: formattedTotalRevenue,
      change: formattedChange, // Formatted percentage change
      chart_data: chartData, // Monthly revenue breakdown for the last 5 months
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
