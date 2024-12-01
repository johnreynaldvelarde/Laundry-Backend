export const handleGetActivityLog = async (req, res, db) => {
  try {
    await db.beginTransaction();

    const [rows] = await db.execute(
      `
      SELECT 
        Activity_Log.id,
        Activity_Log.user_id,
        CONCAT(User_Account.first_name, ' ', COALESCE(User_Account.middle_name, ''), ' ', User_Account.last_name) AS fullname,
        User_Account.username,
        Activity_Log.user_type,
        Activity_Log.action_type,
        Activity_Log.action_description,
        Activity_Log.timestamp
      FROM 
        Activity_Log
      JOIN 
        User_Account ON Activity_Log.user_id = User_Account.id
      ORDER BY 
        Activity_Log.timestamp DESC
      `
    );

    await db.commit();

    res.status(200).json({ data: rows });
  } catch (error) {
    console.error("Error retrieving activity log:", error);
    await db.rollback();
    res.status(500).json({ error: "Failed to retrieve activity log" });
  } finally {
    if (db) db.release();
  }
};

export const handleGetActivityLogStats = async (req, res, db) => {
  try {
    await db.beginTransaction();

    const [rows] = await db.execute(`
      SELECT 
        DAYOFWEEK(timestamp) AS day_of_week,  
        HOUR(timestamp) AS hour_of_day,       
        COUNT(*) AS activity_count
      FROM Activity_Log
      GROUP BY day_of_week, hour_of_day
      ORDER BY day_of_week, hour_of_day;
    `);

    await db.commit();

    const heatmapData = Array.from({ length: 7 }, () => Array(24).fill(0));

    rows.forEach((row) => {
      const { day_of_week, hour_of_day, activity_count } = row;
      heatmapData[day_of_week - 1][hour_of_day] = activity_count;
    });

    res.status(200).json({ data: heatmapData });
  } catch (error) {
    console.error("Error fetching activity log stats:", error);
    await db.rollback();
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    if (db) db.release();
  }
};
