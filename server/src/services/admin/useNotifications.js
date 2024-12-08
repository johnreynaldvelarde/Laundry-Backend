export const handleGetNotificationUser = async (req, res, connection) => {
  const { id } = req.params;
  try {
    await connection.beginTransaction();

    const query = `
        SELECT 
        n.id,
        n.store_id,
        n.user_id,
        n.notification_type,
        n.notification_description,
        n.status,
        n.created_at,
        n.read_at
      FROM Notifications n
      WHERE n.store_id = ? AND n.status = 'Unread'
      ORDER BY n.created_at DESC
      `;

    const [rows] = await connection.execute(query, [id]);

    if (rows.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No notifications found for this store.",
        data: [],
      });
    }

    return res.status(200).json({
      success: true,
      message: "Notifications fetched successfully.",
      data: rows,
    });
  } catch (error) {
    await connection.rollback();
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching data.",
      error: error.message,
    });
  } finally {
    if (connection) connection.release();
  }
};
