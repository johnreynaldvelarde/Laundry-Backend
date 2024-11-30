export const handleCheckUsername = async (req, res, db) => {
  const { username } = req.body;

  try {
    // Query the database to find the username
    const query = "SELECT * FROM User_Account WHERE username = ?";
    const [rows] = await db.execute(query, [username]);

    // Check if any rows are returned, which means the username exists
    if (rows.length > 0) {
      return res
        .status(200)
        .json({ message: `Username '${username}' already exists.` });
    } else {
      return res
        .status(200)
        .json({ message: `Username '${username}' is available.` });
    }
  } catch (error) {
    console.error("Error checking username:", error);
    return res
      .status(500)
      .json({ message: "Server error. Please try again later." });
  }
};

export const handleCheckCustomerDetails = async (req, res, db) => {
  const { id } = req.params;

  console.log(id);

  if (!id) {
    return res
      .status(400)
      .json({ success: false, message: "Username is required" });
  }

  try {
    // Fetch customer details by ID
    const [customerResults] = await db.query(
      "SELECT store_id, address_id FROM User_Account WHERE id = ?",
      [id]
    );

    if (customerResults.length > 0) {
      const customer = customerResults[0];

      const storeIdIsNull = customer.store_id === null;
      const addressIsNull = customer.address_id === null;

      return res.status(200).json({
        success: true,
        data: {
          storeIdIsNull,
          addressIsNull,
        },
      });
    } else {
      return res
        .status(404)
        .json({ success: false, message: "Customer not found" });
    }
  } catch (error) {
    console.error("Error checking customer details:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
