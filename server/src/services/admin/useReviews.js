export const handleGetReviewsList = async (req, res, db) => {
  const { id } = req.params;
  try {
    const query = `
      SELECT 
        fr.id AS review_id,
        fr.rating,
        fr.comment,
        fr.created_at,
        fr.updated_at,
        fr.is_approved,
        CONCAT(ua.first_name, ' ', ua.middle_name, ' ', ua.last_name) AS customer_full_name,
        st.service_name
      FROM Feedback_Review AS fr
      JOIN User_Account AS ua ON fr.customer_id = ua.id
      LEFT JOIN Service_Request AS sr ON fr.service_request_id = sr.id
      LEFT JOIN Service_Type AS st ON sr.service_type_id = st.id
      WHERE fr.store_id = ? 
    `;

    const [rows] = await db.query(query, [id]);
    res.status(200).json({
      success: true,
      data: rows,
    });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const handleUpdateReview = async (req, res, db) => {
  const { id } = req.params; // Review ID
  const { is_approved } = req.body; // New approval status

  try {
    // Update the is_approved field for the specified review
    const updateQuery = `
      UPDATE Feedback_Review 
      SET is_approved = ? 
      WHERE id = ?
    `;

    const [result] = await db.query(updateQuery, [is_approved, id]);

    if (result.affectedRows === 0) {
      return res.status(200).json({
        success: false,
        message: "Review not found or no update made",
      });
    }

    res.status(200).json({
      success: true,
      message: "Review status updated",
    });
  } catch (error) {
    console.error("Error updating review approval status:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
