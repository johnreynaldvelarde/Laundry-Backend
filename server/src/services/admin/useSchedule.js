import { io, userSockets } from "../../socket/socket.js";
import { logNotification } from "../useExtraSystem.js";
import {
  NotificationDescriptions,
  NotificationStatus,
} from "../../helpers/notificationLog.js";

export const handleGetScheduleStatsByAdmin = async (req, res, connection) => {
  try {
    await connection.beginTransaction();

    const currentMonthQuery = `
      SELECT 
        COUNT(*) AS total_requests,
        SUM(CASE WHEN request_status = 'Pending Pickup' THEN 1 ELSE 0 END) AS pending_requests,
        SUM(CASE WHEN request_status = 'Completed Delivery' THEN 1 ELSE 0 END) AS complete_delivery_requests,
        SUM(CASE WHEN request_status = 'Laundry Completed' THEN 1 ELSE 0 END) AS laundry_completed_requests,
        DATE_FORMAT(NOW(), '%Y-%m') AS current_month
      FROM 
        Service_Request
      WHERE 
        YEAR(request_date) = YEAR(CURRENT_DATE())
        AND MONTH(request_date) = MONTH(CURRENT_DATE());
    `;

    // Query for previous month's stats
    const previousMonthQuery = `
      SELECT 
        COUNT(*) AS total_requests,
        SUM(CASE WHEN request_status = 'Pending Pickup' THEN 1 ELSE 0 END) AS pending_requests,
        SUM(CASE WHEN request_status = 'Completed Delivery' THEN 1 ELSE 0 END) AS complete_delivery_requests,
        SUM(CASE WHEN request_status = 'Laundry Completed' THEN 1 ELSE 0 END) AS laundry_completed_requests
      FROM 
        Service_Request
      WHERE 
        YEAR(request_date) = YEAR(DATE_SUB(CURRENT_DATE(), INTERVAL 1 MONTH))
        AND MONTH(request_date) = MONTH(DATE_SUB(CURRENT_DATE(), INTERVAL 1 MONTH));
    `;

    const [currentMonthRows] = await connection.execute(currentMonthQuery);
    const [previousMonthRows] = await connection.execute(previousMonthQuery);

    const currentMonthStats = currentMonthRows[0] || {};
    const previousMonthStats = previousMonthRows[0] || {};

    const totalRequestsCurrent = currentMonthStats.total_requests || 0;
    const pendingRequestsCurrent = currentMonthStats.pending_requests || 0;
    const completeDeliveryRequestsCurrent =
      currentMonthStats.complete_delivery_requests || 0;
    const laundryCompletedRequestsCurrent =
      currentMonthStats.laundry_completed_requests || 0;

    const totalRequestsPrevious = previousMonthStats.total_requests || 0;
    const pendingRequestsPrevious = previousMonthStats.pending_requests || 0;
    const completeDeliveryRequestsPrevious =
      previousMonthStats.complete_delivery_requests || 0;
    const laundryCompletedRequestsPrevious =
      previousMonthStats.laundry_completed_requests || 0;

    const calculatePercentageChange = (current, previous) => {
      if (previous === 0) {
        if (current === 0) {
          return "0.00%"; // No change
        }
        return "+100.00%"; // Full increase when previous is zero
      }
      const change = ((current - previous) / previous) * 100;

      // Limiting the max percentage to 100% and ensuring the value is formatted to 2 decimal places
      return `${Math.min(change, 100).toFixed(2)}%`;
    };

    // Calculate percentage change for total requests
    const totalPercentage = calculatePercentageChange(
      totalRequestsCurrent,
      totalRequestsPrevious
    );
    const pendingPercentage = calculatePercentageChange(
      pendingRequestsCurrent,
      pendingRequestsPrevious
    );
    const completeDeliveryPercentage = calculatePercentageChange(
      completeDeliveryRequestsCurrent,
      completeDeliveryRequestsPrevious
    );
    const laundryCompletedPercentage = calculatePercentageChange(
      laundryCompletedRequestsCurrent,
      laundryCompletedRequestsPrevious
    );

    // Prepare data for response (no store_id included)
    const data = [
      {
        total_requests: totalRequestsCurrent.toString(),
        pending_requests: pendingRequestsCurrent.toString(),
        complete_delivery_requests: completeDeliveryRequestsCurrent.toString(),
        laundry_completed_requests: laundryCompletedRequestsCurrent.toString(),
        current_month: currentMonthStats.current_month,
        total_percentage: totalPercentage,
        pending_percentage: pendingPercentage,
        complete_delivery_percentage: completeDeliveryPercentage,
        laundry_completed_percentage: laundryCompletedPercentage,
      },
    ];

    await connection.commit();

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("Error:", error);
    await connection.rollback();
    res.status(500).json({
      success: false,
      message: "Failed to retrieve schedule statistics.",
    });
  }
};

export const handleGetScheduleStatsByUser = async (req, res, connection) => {
  const { id: store_id } = req.params;

  try {
    await connection.beginTransaction();

    const currentMonthQuery = `
      SELECT 
        COUNT(*) AS total_requests,
        SUM(CASE WHEN request_status = 'Pending Pickup' THEN 1 ELSE 0 END) AS pending_requests,
        SUM(CASE WHEN request_status = 'Completed Delivery' THEN 1 ELSE 0 END) AS complete_delivery_requests,
        SUM(CASE WHEN request_status = 'Laundry Completed' THEN 1 ELSE 0 END) AS laundry_completed_requests,
        DATE_FORMAT(NOW(), '%Y-%m') AS current_month
      FROM 
        Service_Request
      WHERE 
        store_id = ? 
        AND YEAR(request_date) = YEAR(CURRENT_DATE())
        AND MONTH(request_date) = MONTH(CURRENT_DATE());
    `;

    // Query for previous month's stats
    const previousMonthQuery = `
      SELECT 
        COUNT(*) AS total_requests,
        SUM(CASE WHEN request_status = 'Pending Pickup' THEN 1 ELSE 0 END) AS pending_requests,
        SUM(CASE WHEN request_status = 'Completed Delivery' THEN 1 ELSE 0 END) AS complete_delivery_requests,
        SUM(CASE WHEN request_status = 'Laundry Completed' THEN 1 ELSE 0 END) AS laundry_completed_requests
      FROM 
        Service_Request
      WHERE 
        store_id = ? 
        AND YEAR(request_date) = YEAR(DATE_SUB(CURRENT_DATE(), INTERVAL 1 MONTH))
        AND MONTH(request_date) = MONTH(DATE_SUB(CURRENT_DATE(), INTERVAL 1 MONTH));
    `;

    const [currentMonthRows] = await connection.execute(currentMonthQuery, [
      store_id,
    ]);
    const [previousMonthRows] = await connection.execute(previousMonthQuery, [
      store_id,
    ]);

    const currentMonthStats = currentMonthRows[0] || {};
    const previousMonthStats = previousMonthRows[0] || {};

    const totalRequestsCurrent = currentMonthStats.total_requests || 0;
    const pendingRequestsCurrent = currentMonthStats.pending_requests || 0;
    const completeDeliveryRequestsCurrent =
      currentMonthStats.complete_delivery_requests || 0;
    const laundryCompletedRequestsCurrent =
      currentMonthStats.laundry_completed_requests || 0;

    const totalRequestsPrevious = previousMonthStats.total_requests || 0;
    const pendingRequestsPrevious = previousMonthStats.pending_requests || 0;
    const completeDeliveryRequestsPrevious =
      previousMonthStats.complete_delivery_requests || 0;
    const laundryCompletedRequestsPrevious =
      previousMonthStats.laundry_completed_requests || 0;

    const calculatePercentageChange = (current, previous) => {
      if (previous === 0) {
        if (current === 0) {
          return "0.00%"; // No change
        }
        return "+100.00%"; // Full increase when previous is zero
      }
      const change = ((current - previous) / previous) * 100;

      // Limiting the max percentage to 100% and ensuring the value is formatted to 2 decimal places
      return `${Math.min(change, 100).toFixed(2)}%`;
    };

    // Calculate percentage change for total requests
    const totalPercentage = calculatePercentageChange(
      totalRequestsCurrent,
      totalRequestsPrevious
    );
    const pendingPercentage = calculatePercentageChange(
      pendingRequestsCurrent,
      pendingRequestsPrevious
    );
    const completeDeliveryPercentage = calculatePercentageChange(
      completeDeliveryRequestsCurrent,
      completeDeliveryRequestsPrevious
    );
    const laundryCompletedPercentage = calculatePercentageChange(
      laundryCompletedRequestsCurrent,
      laundryCompletedRequestsPrevious
    );

    // Prepare data for response
    const data = [
      {
        store_id: parseInt(store_id, 10),
        total_requests: totalRequestsCurrent.toString(),
        pending_requests: pendingRequestsCurrent.toString(),
        complete_delivery_requests: completeDeliveryRequestsCurrent.toString(),
        laundry_completed_requests: laundryCompletedRequestsCurrent.toString(),
        current_month: currentMonthStats.current_month,
        total_percentage: totalPercentage,
        pending_percentage: pendingPercentage,
        complete_delivery_percentage: completeDeliveryPercentage,
        laundry_completed_percentage: laundryCompletedPercentage,
      },
    ];

    await connection.commit();

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("Error:", error);
    await connection.rollback();
    res.status(500).json({
      success: false,
      message: "Failed to retrieve schedule statistics.",
    });
  }
};

export const handleGetScheduleServiceRequest = async (req, res, connection) => {
  const { id: store_id } = req.params;

  try {
    await connection.beginTransaction();

    const query = `
      SELECT 
        sr.id,
        sr.store_id,
        sr.user_id,
        COALESCE(CONCAT(u.first_name, ' ', COALESCE(u.middle_name, ''), ' ', u.last_name), 'Not Assigned') AS user_fullname,
        sr.customer_id,
        CONCAT(c.first_name, ' ', COALESCE(c.middle_name, ''), ' ', c.last_name) AS customer_fullname,
        sr.service_type_id,
        st.service_name,
        sr.tracking_code,
        sr.customer_fullname AS original_customer_fullname,
        sr.customer_type,
        sr.notes,
        sr.request_date,
        sr.pickup_date,
        sr.delivery_date,
        sr.request_status,
        sr.qr_code,
        sr.qr_code_generated,
        sr.isPickup,
        sr.isDelivery,
        sr.payment_method
      FROM 
        Service_Request AS sr
      LEFT JOIN 
        User_Account AS u ON sr.user_id = u.id
      LEFT JOIN 
        User_Account AS c ON sr.customer_id = c.id
      LEFT JOIN 
        Service_Type AS st ON sr.service_type_id = st.id
      WHERE 
        sr.store_id = ?
      ORDER BY
        CASE 
          WHEN sr.request_status = 'Pending Pickup' THEN 1
          WHEN sr.request_status = 'Ongoing Pickup' THEN 2
          WHEN sr.request_status = 'Completed Pickup' THEN 3
          WHEN sr.request_status = 'At Store' THEN 4
          WHEN sr.request_status = 'In Queue' THEN 5
          WHEN sr.request_status = 'Ready for Delivery' THEN 6
          WHEN sr.request_status = 'Out for Delivery' THEN 7
          ELSE 5
        END;
    `;

    const [rows] = await connection.execute(query, [store_id]);

    await connection.commit();

    res.status(200).json({
      success: true,
      data: rows,
    });
  } catch (error) {
    console.error("Error:", error);
    await connection.rollback();
    res.status(500).json({
      success: false,
      message: "Failed to retrieve service requests.",
    });
  }
};

export const handleGetSelectedStaff = async (req, res, connection) => {
  const { id } = req.params;

  try {
    await connection.beginTransaction();
    const query = `
      SELECT 
        id,
        CONCAT(first_name, ' ', IFNULL(middle_name, ''), ' ', last_name) AS fullname,
        user_type,
        date_created
      FROM User_Account
      WHERE store_id = ? 
        AND isArchive = 0 
        AND user_type = 'Delivery Staff' 
      ORDER BY date_created DESC
    `;

    const [results] = await connection.execute(query, [id]);

    await connection.commit();

    res.status(200).json({ data: results });
  } catch (error) {
    await connection.rollback();
    res
      .status(500)
      .json({ error: "An error occurred while fetching the staff list." });
  }
};

//#COMPLETE PICKUP TO At Store
export const handleUpdateServiceRequestCompletedPickup = async (
  req,
  res,
  connection
) => {
  const { id } = req.params;

  try {
    await connection.beginTransaction();

    const getCustomerIdQuery = `
      SELECT customer_id 
      FROM Service_Request 
      WHERE id = ?
    `;
    const [customerRows] = await connection.execute(getCustomerIdQuery, [id]);

    if (customerRows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Request not found." });
    }

    const { customer_id } = customerRows[0];

    const updateQuery = `
      UPDATE Service_Request
      SET request_status = 'At Store'
      WHERE id = ?`;

    await connection.execute(updateQuery, [id]);

    const updateProgressQuery = `
      UPDATE Service_Progress
      SET completed = true,
          status_date = NOW()
      WHERE service_request_id = ? AND stage = 'At Store'`;

    await connection.execute(updateProgressQuery, [id]);

    const notificationType = NotificationStatus.AT_STORE;
    const notificationDescription =
      NotificationDescriptions[notificationType]();

    await logNotification(
      connection,
      null,
      customer_id,
      notificationType,
      notificationDescription
    );

    await connection.commit();

    for (const userId in userSockets) {
      const userSocket = userSockets[userId];

      if (
        userSocket.userId === customer_id &&
        userSocket.userType == "Customer"
      ) {
        io.to(userSocket.socketId).emit("notificationsModuleForCustomer", {
          title: notificationType,
          message: notificationDescription,
        });
      }
    }

    res.status(200).json({
      success: true,
      message: "Request status updated to At Store.",
    });
  } catch (error) {
    await connection.rollback();
    res.status(500).json({
      success: false,
      message: "An error occurred while updating the request.",
    });
  } finally {
    connection.release();
  }
};

export const handleUpdateServiceRequestAtStoreToInQueue = async (
  req,
  res,
  connection
) => {
  const { id } = req.params;

  try {
    await connection.beginTransaction();

    const getCustomerIdQuery = `
      SELECT customer_id 
      FROM Service_Request 
      WHERE id = ?
    `;
    const [customerRows] = await connection.execute(getCustomerIdQuery, [id]);

    if (customerRows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Request not found." });
    }

    const { customer_id } = customerRows[0];

    const updateQuery = `
      UPDATE Service_Request
      SET request_status = 'In Queue'
      WHERE id = ?`;

    await connection.execute(updateQuery, [id]);

    const updateProgressQuery = `
      UPDATE Service_Progress
      SET completed = true,
          status_date = NOW()
      WHERE service_request_id = ? AND stage = 'In Queue'`;

    await connection.execute(updateProgressQuery, [id]);

    const notificationType = NotificationStatus.IN_QUEUE;
    const notificationDescription =
      NotificationDescriptions[notificationType]();

    await logNotification(
      connection,
      null,
      customer_id,
      notificationType,
      notificationDescription
    );

    await connection.commit();

    for (const userId in userSockets) {
      const userSocket = userSockets[userId];

      if (
        userSocket.userId === customer_id &&
        userSocket.userType == "Customer"
      ) {
        io.to(userSocket.socketId).emit("notificationsModuleForCustomer", {
          title: notificationType,
          message: notificationDescription,
        });
      }
    }

    res.status(200).json({
      success: true,
      message: "Request status updated to In Queue.",
    });
  } catch (error) {
    await connection.rollback();
    res.status(500).json({
      success: false,
      message: "An error occurred while updating the request.",
    });
  } finally {
    connection.release();
  }
};
