import { ActionDescriptions, ActionTypes } from "../../helpers/activityLog.js";
import { logActivity } from "../useExtraSystem.js";

//#POST
export const handleCreateNewItem = async (req, res, connection) => {
  const {
    store_id,
    category_id,
    item_name,
    price,
    activity_id,
    activity_username,
    activity_roleName,
  } = req.body;

  try {
    await connection.beginTransaction();

    const checkQuery = `
      SELECT id FROM Item 
      WHERE item_name = ? 
      AND store_id = ? 
      AND isArchive = 0
    `;

    const [existingItem] = await connection.execute(checkQuery, [
      item_name,
      store_id,
    ]);

    if (existingItem.length > 0) {
      return res.status(200).json({
        success: false,
        message: "Item name already exists in this store",
      });
    }

    const insertItemQuery = `
    INSERT INTO Item (category_id, store_id, item_name, isArchive, date_created, updated_at) 
    VALUES (?, ?, ?,  0, NOW(), NOW())
  `;
    const [result] = await connection.execute(insertItemQuery, [
      category_id,
      store_id,
      item_name,
    ]);

    const itemId = result.insertId;

    // Insert into Inventory
    const insertInventoryQuery = `  
    INSERT INTO Inventory (store_id, item_id, price, quantity, isStatus) 
    VALUES (?, ?, ?, 0, 0)
  `;
    await connection.execute(insertInventoryQuery, [store_id, itemId, price]);

    const actionType = ActionTypes.INVENTORY_MANAGEMENT;
    const actionDescription = ActionDescriptions[actionType].ADD_ITEM(
      activity_username,
      item_name
    );

    await logActivity(
      connection,
      activity_id,
      activity_roleName,
      actionType,
      actionDescription
    );

    await connection.commit();

    res
      .status(201)
      .json({ success: true, message: "Item successfully created." });
  } catch (error) {
    console.error("Error creating new item:", error);
    res.status(500).json({ success: false, message: "Server error" });
  } finally {
    if (connection) connection.release();
  }
};

export const handleCreateItemCategory = async (req, res, db) => {
  const { activity_id, activity_username, activity_roleName, category_name } =
    req.body;

  try {
    await db.beginTransaction();

    const [existingCategoryName] = await db.execute(
      "SELECT * FROM Item_Category WHERE category_name = ?",
      [category_name]
    );
    if (
      existingCategoryName.length > 0 &&
      existingCategoryName[0].isArchive === 0
    ) {
      return res.status(200).json({
        success: false,
        message: "Category name already exists",
      });
    }

    await db.execute(
      "INSERT INTO Item_Category (category_name, isArchive, updated_at, date_created) VALUES (?, ?, NOW(), NOW())",
      [category_name, false]
    );

    const actionType = ActionTypes.INVENTORY_MANAGEMENT;
    const actionDescription = ActionDescriptions[actionType].ADD_CATEGORY(
      activity_username,
      category_name
    );

    await logActivity(
      db,
      activity_id,
      activity_roleName,
      actionType,
      actionDescription
    );

    await db.commit();

    res.status(200).json({
      success: true,
      message: "Category created successfully",
    });
  } catch (error) {
    await db.rollback();
    console.error("Error creating new category:", error);
    res.status(500).json({ success: false, message: "Server error" });
  } finally {
    if (db) db.release();
  }
};

export const handleCreateReuseItem = async (req, res, connection) => {
  const { store_id, item_id } = req.body;

  try {
    await connection.beginTransaction();

    const checkItemQuery = `
      SELECT * FROM Inventory 
      WHERE store_id = ? AND item_id = ?
    `;
    const [existingItem] = await connection.execute(checkItemQuery, [
      store_id,
      item_id,
    ]);

    if (existingItem.length > 0) {
      return res
        .status(200)
        .json({ success: false, message: "Item already exists in inventory." });
    }

    const insertInventoryQuery = `
      INSERT INTO Inventory (store_id, item_id, price, quantity, isStatus) 
      VALUES (?, ?, ?, ?, ?)
    `;

    const price = 0;
    const quantity = 0;
    const isStatus = 0;

    await connection.execute(insertInventoryQuery, [
      store_id,
      item_id,
      price,
      quantity,
      isStatus,
    ]);

    await connection.commit();

    res.status(201).json({
      success: true,
      message: "Item added to inventory successfully.",
    });
  } catch (error) {
    await connection.rollback();
    console.error("Error creating new item:", error);
    res.status(500).json({ success: false, message: "Server error" });
  } finally {
    if (connection) connection.release();
  }
};

//#GET
export const handleViewInventory = async (req, res, db) => {
  const { store_id } = req.query;
  try {
    const query = `
      SELECT 
        Inventory.id AS inventory_id,
        Inventory.item_id,
        Inventory.price,
        Inventory.quantity,
        Inventory.isStatus,
        Item.category_id,
        Item.item_name,
        Item.date_created,
        Item_Category.category_name
      FROM Inventory
      JOIN Item ON Inventory.item_id = Item.id
      JOIN Item_Category ON Item.category_id = Item_Category.id
      WHERE Inventory.store_id = ? AND Item.isArchive = 0
    `;

    const [rows] = await db.query(query, [store_id]);
    res.status(200).json({
      success: true,
      data: rows,
    });
  } catch (error) {
    console.error("Error fetching inventory data:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const handleGetCategory = async (req, res, db) => {
  try {
    const query = `
      SELECT id, category_name
      FROM Item_Category
      WHERE isArchive = 0;
    `;
    const [rows] = await db.query(query);

    res.json(rows);
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const handleViewListCategory = async (req, res, db) => {
  const { store_id } = req.query;
  try {
    if (!store_id) {
      return res.status(400).json({
        success: false,
        message: "Store ID is required",
      });
    }

    const sqlQuery = `
      SELECT 
          c.id AS category_id,
          c.category_name,
          c.date_created,
          COUNT(i.id) AS number_of_items
      FROM 
          Item_Category c
      LEFT JOIN 
          Item i ON c.id = i.category_id
      LEFT JOIN 
          Inventory inv ON i.id = inv.item_id AND inv.store_id = ?
      WHERE 
          c.isArchive = 0
      GROUP BY 
          c.id, c.category_name, c.date_created;
    `;

    const [rows] = await db.query(sqlQuery, [store_id]);
    res.status(200).json({
      success: true,
      data: rows,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const handleGetItemListToReuse = async (req, res, db) => {
  const { id } = req.params;

  try {
    const query = `
      SELECT i.id, i.item_name
      FROM Item AS i
      LEFT JOIN Inventory AS inv ON i.id = inv.item_id
      WHERE i.isArchive = 0
        AND (inv.store_id IS NULL OR inv.store_id <> ?)
    `;

    const [rows] = await db.query(query, [id]);
    res.status(200).json({
      success: true,
      data: rows,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

//#PUT
export const handleUpdateCategoryName = async (req, res, connection) => {
  const { id } = req.params;
  const { category_name, activity_id, activity_username, activity_roleName } =
    req.body;

  try {
    await connection.beginTransaction();

    const checkQuery = `
      SELECT id FROM Item_Category
      WHERE category_name = ? AND id != ?
    `;
    const [existingCategory] = await connection.execute(checkQuery, [
      category_name,
      id,
    ]);

    if (existingCategory.length > 0) {
      return res.status(200).json({
        status: false,
        message: "Category name already exists for another category.",
      });
    }

    const updateQuery = `
      UPDATE Item_Category
      SET category_name = ?
      WHERE id = ?
    `;

    await connection.execute(updateQuery, [category_name, id]);

    const actionType = ActionTypes.INVENTORY_MANAGEMENT;
    const actionDescription = ActionDescriptions[actionType].UPDATE_CATEGORY(
      activity_username,
      category_name
    );

    await logActivity(
      connection,
      activity_id,
      activity_roleName,
      actionType,
      actionDescription
    );

    await connection.commit();

    res.status(200).json({
      success: true,
      message: "Category name updated successfully.",
    });
  } catch (error) {
    await connection.rollback();
    console.error("Error updating category:", error);
    res
      .status(500)
      .json({ error: "An error occurred while updating the category." });
  } finally {
    if (connection) connection.release();
  }
};

export const handleUpdateRemoveCategory = async (req, res, connection) => {
  const { id } = req.params;
  const { activity_id, activity_username, activity_roleName } = req.body;

  try {
    await connection.beginTransaction();

    const categoryQuery = `
     SELECT category_name
     FROM Item_Category
     WHERE id = ?
   `;
    const [categoryRows] = await connection.execute(categoryQuery, [id]);
    if (categoryRows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }
    const category_name = categoryRows[0].category_name;

    const checkQuery = `
      SELECT COUNT(*) AS count
      FROM Item
      WHERE category_id = ? AND isArchive = 0
    `;
    const [rows] = await connection.execute(checkQuery, [id]);
    const itemCount = rows[0].count;

    if (itemCount > 0) {
      return res.status(200).json({
        success: false,
        message: "Cannot archive category; items are active",
      });
    }

    const updateQuery = `
      UPDATE Item_Category
      SET isArchive = 1
      WHERE id = ?
    `;
    await connection.execute(updateQuery, [id]);

    const actionType = ActionTypes.INVENTORY_MANAGEMENT;
    const actionDescription = ActionDescriptions[actionType].DELETE_CATEGORY(
      activity_username,
      category_name
    );

    await logActivity(
      connection,
      activity_id,
      activity_roleName,
      actionType,
      actionDescription
    );

    await connection.commit();
    res
      .status(200)
      .json({ success: true, message: "Category archived successfully." });
  } catch (error) {
    await connection.rollback();
    console.error("Error updating category:", error);
    res
      .status(500)
      .json({ error: "An error occurred while updating the category." });
  } finally {
    if (connection) connection.release();
  }
};

export const handleUpdateStock = async (req, res, connection) => {
  const { id } = req.params;
  const { quantity, activity_id, activity_username, activity_roleName } =
    req.body;

  try {
    await connection.beginTransaction();

    const [itemResult] = await connection.execute(
      `SELECT i.item_name 
     FROM Inventory inv
     JOIN Item i ON inv.item_id = i.id
     WHERE inv.id = ?`,
      [id]
    );

    if (itemResult.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Item not found in inventory",
      });
    }

    const item_name = itemResult[0].item_name;

    const updateQuery = `
      UPDATE Inventory
      SET quantity = quantity + ?, isStatus = 1
      WHERE id = ?
    `;

    await connection.execute(updateQuery, [quantity, id]);

    const actionType = ActionTypes.INVENTORY_MANAGEMENT;
    const actionDescription = ActionDescriptions[actionType].UPDATE_STOCK(
      activity_username,
      item_name
    );

    await logActivity(
      connection,
      activity_id,
      activity_roleName,
      actionType,
      actionDescription
    );

    await connection.commit();
    res
      .status(200)
      .json({ success: true, message: "Inventory restocked successfully." });
  } catch (error) {
    await connection.rollback();
    console.error("Error updating inventory:", error);
    res.status(500).json({ error: "Error updating inventory." });
  } finally {
    if (connection) connection.release();
  }
};

export const handleUpdateItem = async (req, res, connection) => {
  const { id } = req.params; // Item ID to update
  const {
    item_name,
    price,
    category_id,
    status,
    activity_id,
    activity_username,
    activity_roleName,
  } = req.body;

  try {
    await connection.beginTransaction();

    const [existingItem] = await connection.execute(
      `SELECT id FROM Item WHERE item_name = ? AND id != ? AND isArchive = 0`,
      [item_name, id]
    );

    if (existingItem.length > 0) {
      await connection.rollback();
      return res.status(200).json({
        success: false,
        message: "Item name already exists for a different item.",
      });
    }

    const updateItemQuery = `
      UPDATE Item 
      SET item_name = ?, category_id = ?, updated_at = NOW()
      WHERE id = ? AND isArchive = 0;
    `;
    await connection.execute(updateItemQuery, [item_name, category_id, id]);

    const updateInventoryQuery = `
      UPDATE Inventory 
      SET price = ?, isStatus = ?
      WHERE item_id = ?;
    `;
    await connection.execute(updateInventoryQuery, [price, status, id]);

    const actionType = ActionTypes.INVENTORY_MANAGEMENT;
    const actionDescription = ActionDescriptions[actionType].UPDATE_ITEM(
      activity_username,
      item_name
    );

    await logActivity(
      connection,
      activity_id,
      activity_roleName,
      actionType,
      actionDescription
    );

    await connection.commit();
    res.status(200).json({
      success: true,
      message: "Item and inventory updated successfully.",
    });
  } catch (error) {
    await connection.rollback();
    console.error("Error updating item and inventory:", error);
    res.status(500).json({
      error: "An error occurred while updating the item and inventory.",
    });
  } finally {
    if (connection) connection.release();
  }
};

export const handleRemoveItem = async (req, res, connection) => {
  const { id } = req.params;
  const { activity_id, activity_username, activity_roleName } = req.body;

  try {
    await connection.beginTransaction();

    const [itemResult] = await connection.execute(
      `SELECT i.item_name 
     FROM Inventory inv
     JOIN Item i ON inv.item_id = i.id
     WHERE inv.id = ?`,
      [id]
    );

    if (itemResult.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Item not found in inventory",
      });
    }

    const item_name = itemResult[0].item_name;

    const [rows] = await connection.execute(
      `SELECT quantity FROM Inventory WHERE item_id = ?`,
      [id]
    );

    if (rows.length > 0 && rows[0].quantity > 0) {
      await connection.rollback();
      return res.status(200).json({
        success: false,
        message: "Item has stock remaining and cannot be archived.",
      });
    }

    const updateQuery = `
      UPDATE Item
      SET isArchive = 1, updated_at = NOW()
      WHERE id = ?;
    `;

    await connection.execute(updateQuery, [id]);

    const actionType = ActionTypes.INVENTORY_MANAGEMENT;
    const actionDescription = ActionDescriptions[actionType].DELETE_ITEM(
      activity_username,
      item_name
    );

    await logActivity(
      connection,
      activity_id,
      activity_roleName,
      actionType,
      actionDescription
    );

    await connection.commit();
    res
      .status(200)
      .json({ success: true, message: "Item archived successfully." });
  } catch (error) {
    await connection.rollback();
    console.error("Error updating inventory:", error);
    res.status(500).json({ error: "Error updating inventory." });
  } finally {
    if (connection) connection.release();
  }
};
