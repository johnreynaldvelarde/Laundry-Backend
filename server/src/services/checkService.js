export const handleGenerateUnitName = async (req, res, db) => {
  try {
    const { store_id } = req.query; // Use query parameters

    // Validate input
    if (!store_id) {
      return res.status(400).json({ success: false, message: "Store ID is required" });
    }

    // Query to get existing unit names for the given store_id
    const [units] = await db.query(
      'SELECT unit_name FROM Laundry_Unit WHERE store_id = ?',
      [store_id]
    );

    // Extract the numeric part of unit names
    const unitNumbers = units
      .map(unit => parseInt(unit.unit_name.replace('Unit ', ''), 10))
      .filter(num => !isNaN(num));

    // Determine the lowest available unit number
    let newUnitName = "Unit 1"; // Default name if no units exist

    if (unitNumbers.length > 0) {
      // Find the smallest number that isn't used
      const usedNumbers = new Set(unitNumbers);
      let nextNumber = 1;
      while (usedNumbers.has(nextNumber)) {
        nextNumber++;
      }
      newUnitName = `Unit ${nextNumber}`;
    }

    // Send the new unit name as a response
    res.status(200).json({
      success: true,
      unit_name: newUnitName,
    });
  } catch (error) {
    console.error("Error generating unit name:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
