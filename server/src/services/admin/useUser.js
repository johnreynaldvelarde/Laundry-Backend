import { ActionDescriptions, ActionTypes } from "../../helpers/activityLog.js";
import { logActivity } from "../useExtraSystem.js";
import { generatePasswordSalt, hashPassword } from "../../helpers/auth.js";

// POST
export const handleSetRolesPermissions = async (req, res, connection) => {
  const { id } = req.params;
  const { role_name, permissionsStatus } = req.body;

  try {
    await connection.beginTransaction();

    const userQuery = `
      SELECT role_permissions_id 
      FROM User_Account 
      WHERE id = ? AND isArchive = 0
    `;
    const [userResults] = await connection.execute(userQuery, [id]);

    if (userResults.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const createRolePermissionsQuery = `
      INSERT INTO Roles_Permissions (role_name, can_read, can_write, can_edit, can_delete, date_created)
      VALUES (?, ?, ?, ?, ?, NOW())
    `;

    const permissions = {
      can_read: permissionsStatus.Read,
      can_write: permissionsStatus.Write,
      can_edit: permissionsStatus.Edit,
      can_delete: permissionsStatus.Delete,
    };

    await connection.execute(createRolePermissionsQuery, [
      role_name,
      permissions.can_read,
      permissions.can_write,
      permissions.can_edit,
      permissions.can_delete,
    ]);

    const actionType = ActionTypes.AUTHENTICATION;
    const actionDescription = ActionDescriptions[actionType].LOGIN(username);

    // await logActivity(connection, user.id, roleName, actionType, actionDescription);

    await connection.commit();

    res.json({
      success: true,
      message: "Role permissions created.",
    });
  } catch (error) {
    await connection.rollback();
    console.error("Error creating roles and permissions:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while creating role permissions.",
    });
  } finally {
    if (connection) connection.release();
  }
};

// POST
export const handleAdminBasedSetNewUser = async (req, res, connection) => {
  const {
    activity_id,
    activity_username,
    activity_roleName,
    store_id,
    role_permissions_id,
    username,
    password,
    mobile_number,
    email,
    first_name,
    middle_name,
    last_name,
    isStatus,
  } = req.body;

  try {
    await connection.beginTransaction();

    const checkQuery = `
      SELECT username FROM User_Account 
      WHERE username = ? AND isArchive = 0
    `;

    const [existingUser] = await connection.execute(checkQuery, [username]);

    if (existingUser.length > 0) {
      return res
        .status(200)
        .json({ success: false, message: "Username already exists." });
    }

    const hashedPassword = await hashPassword(password);
    const passwordSalt = await generatePasswordSalt();

    const roleNameQuery = `
     SELECT role_name FROM Roles_Permissions WHERE id = ?
   `;
    const [roleResult] = await connection.execute(roleNameQuery, [
      role_permissions_id,
    ]);

    if (roleResult.length === 0) {
      await connection.rollback();
      return res
        .status(400)
        .json({ success: false, message: "Invalid role_permissions_id." });
    }

    const role_name = roleResult[0].role_name;

    const userAccountQuery = `
      INSERT INTO User_Account
      (store_id, role_permissions_id, username, email, mobile_number, first_name, middle_name, last_name, user_type, isStatus, date_created, isOnline, isAgreement, isArchive)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), FALSE, TRUE, FALSE)
    `;

    const [insertUserResult] = await connection.execute(userAccountQuery, [
      store_id,
      role_permissions_id,
      username,
      email || null,
      mobile_number,
      first_name,
      middle_name,
      last_name,
      role_name,
      isStatus,
    ]);

    const newUserId = insertUserResult.insertId;

    const userSecurityQuery = `
       INSERT INTO User_Security
       (user_id, password, password_salt, mfa_enabled, failed_login_attempts, account_locked, last_login, last_logout, last_password_change)
       VALUES (?, ?, ?, 0, 0, 0, null, null, NOW())
     `;
    await connection.execute(userSecurityQuery, [
      newUserId,
      hashedPassword,
      passwordSalt,
    ]);

    const actionType = ActionTypes.USER_MANAGEMENT;
    const actionDescription = ActionDescriptions[actionType].ADD_USER(
      activity_username,
      username
    );

    await logActivity(
      connection,
      activity_id,
      activity_roleName,
      actionType,
      actionDescription
    );

    await connection.commit();

    return res
      .status(201)
      .json({ success: true, message: "User created successfully." });
  } catch (error) {
    await connection.rollback();
    console.error("Error creating user:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while creating the user.",
    });
  } finally {
    if (connection) connection.release();
  }
};

// GET
export const handleGetRolesPermissions = async (req, res, connection) => {
  const { id } = req.params; // user id

  try {
    await connection.beginTransaction();

    // Query to get the role_permissions_id from User_Account
    const userQuery = `
      SELECT role_permissions_id 
      FROM User_Account 
      WHERE id = ? AND isArchive = 0
    `;
    const [userResults] = await connection.execute(userQuery, [id]);

    // If user is not found, return 404
    if (userResults.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const { role_permissions_id } = userResults[0];

    // Query to get the user's role details from Roles_Permissions
    const roleQuery = `
      SELECT role_name, can_read, can_write, can_edit, can_delete 
      FROM Roles_Permissions 
      WHERE id = ? AND isArchive = 0
    `;
    const [roleResults] = await connection.execute(roleQuery, [
      role_permissions_id,
    ]);

    // If no role is found, return 404
    if (roleResults.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Role not found" });
    }

    const role = roleResults[0];

    // Check if the role_name is 'Administrator'
    if (role.role_name === "Administrator") {
      // If Administrator, fetch all roles and count how many users are assigned to each role
      const allRolesQuery = `
        SELECT rp.id, rp.role_name, rp.can_read, rp.can_write, rp.can_edit, rp.can_delete, rp.date_created, rp.isArchive,
          (SELECT COUNT(*) FROM User_Account ua WHERE ua.role_permissions_id = rp.id AND ua.isArchive = 0) AS user_count
        FROM Roles_Permissions rp
        WHERE rp.isArchive = 0
        AND rp.role_name != 'Administrator'
      `;
      const [allRolesResults] = await connection.execute(allRolesQuery);

      return res.status(200).json({
        success: true,
        message: "User is an Administrator",
        data: allRolesResults, // Return all roles and the number of users for each role
      });
    } else {
      // If not an Administrator, deny access to roles data
      return res.status(403).json({
        success: false,
        message: "Access denied. Only Administrators can view all roles.",
      });
    }
  } catch (error) {
    await connection.rollback();
    console.error("Error fetching roles and permissions:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching data.",
    });
  } finally {
    if (connection) connection.release();
  }
};

// #For getting store the user count related to it
export const handleGetStoresBasedAdmin = async (req, res, connection) => {
  const { id } = req.params; // user id


  try {
    await connection.beginTransaction();
    const userQuery = `
      SELECT role_permissions_id 
      FROM User_Account 
      WHERE id = ? AND isArchive = 0
    `;
    const [userResults] = await connection.execute(userQuery, [id]);
    if (userResults.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    const { role_permissions_id } = userResults[0];
    const roleQuery = `
      SELECT role_name, can_read, can_write, can_edit, can_delete 
      FROM Roles_Permissions 
      WHERE id = ? AND isArchive = 0
    `;
    const [roleResults] = await connection.execute(roleQuery, [
      role_permissions_id,
    ]);

    if (roleResults.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Role not found" });
    }

    const role = roleResults[0];

    if (role.role_name === "Administrator") {
      const allStoresQuery = `
        SELECT s.id, s.store_no, s.store_name, s.store_contact, s.store_email, s.is_main_store, s.updated_at, s.date_created, s.isStatus, s.isArchive,
          (SELECT COUNT(*) 
          FROM User_Account ua 
          JOIN Roles_Permissions rp ON ua.role_permissions_id = rp.id
          WHERE ua.store_id = s.id 
          AND ua.isArchive = 0
          AND rp.role_name != 'Administrator') AS user_count
        FROM Stores s
        WHERE s.isArchive = 0
      `;

      console.log(allStoresQuery);

      const [allStoresResults] = await connection.execute(allStoresQuery);

      return res.status(200).json({
        success: true,
        message: "Store list retrieved successfully",
        data: allStoresResults,
      });
    } else {
      return res.status(403).json({
        success: false,
        message: "Access denied. Only Administrators can view all stores",
      });
    }
  } catch (error) {
    await connection.rollback();
    console.error("Error fetching roles and permissions:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching data.",
    });
  } finally {
    if (connection) connection.release();
  }
};

export const handleGetBasedUser = async (req, res, connection) => {
  const { id } = req.params;

  try {
    await connection.beginTransaction();

    // Check if the user exists and their role
    const checkQuery = `
      SELECT 
        UA.id, UA.username, UA.role_permissions_id, RP.role_name
      FROM 
        User_Account UA
      JOIN 
        Roles_Permissions RP ON UA.role_permissions_id = RP.id
      WHERE 
        UA.id = ? AND UA.isArchive = 0
    `;

    const [existingUser] = await connection.execute(checkQuery, [id]);

    if (existingUser.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    const user = existingUser[0];

    // Check if the user is an administrator
    if (user.role_name === "Administrator") {
      const getQuery = `
      SELECT
        ua.id AS user_id,
        ua.store_id,
        ua.username,
        ua.email,
        ua.mobile_number,
        ua.first_name,
        ua.middle_name,
        ua.last_name,
        ua.isOnline,
        CASE
            WHEN ua.isStatus = 1 THEN 'Active'
            WHEN ua.isStatus = 0 THEN 'Deactivated'
            ELSE 'Unknown'
        END AS isStatus,
        ua.isArchive,
        ua.date_created,
        rp.role_name,
        rp.can_read,
        rp.can_write,
        rp.can_edit,
        rp.can_delete
      FROM User_Account ua
      JOIN Roles_Permissions rp ON ua.role_permissions_id = rp.id
      WHERE ua.id != ? AND ua.isArchive = 0
      `;

      const [users] = await connection.execute(getQuery, [id]);

      await connection.commit();

      return res.status(200).json({
        success: true,
        data: users,
      });
    } else {
      return res.status(403).json({
        success: false,
        message: "The user account is not an administrator.",
      });
    }
  } catch (error) {
    console.error("Error fetching user", error);
    await connection.rollback();
    res.status(500).json({ error: "Server error" });
  } finally {
    if (connection) connection.release();
  }
};

// export const handleGetBasedListUser = async (req, res, connection) => {
//   const { id } = req.params;
//   const { userId } = req.query;
//   try {
//     await connection.beginTransaction();

//     const checkQuery = `
//       SELECT id FROM Stores WHERE id = ? LIMIT 1
//     `;
//     const [existingStore] = await connection.execute(checkQuery, [id]);

//     if (existingStore.length === 0) {
//       return res.status(404).json({
//         success: false,
//         message: "Store not found.",
//       });
//     }

//     const getQuery = `
//       SELECT
//         id,
//         store_id,
//         username,
//         email,
//         CONCAT(first_name, ' ', COALESCE(middle_name, ''), ' ', last_name) AS full_name,
//         user_type,
//         isOnline,
//         isStatus,
//         date_created
//       FROM User_Account
//       WHERE store_id = ?
//         AND user_type NOT IN ('Customer', 'Administrator')
//         AND isArchive = 0
//         AND id != ?;
//     `;
//     const [users] = await connection.execute(getQuery, [id, userId]);

//     await connection.commit();

//     return res.status(200).json({
//       success: true,
//       data: users,
//     });
//   } catch (error) {
//     console.error("Error fetching users:", error);
//     await connection.rollback();
//     res.status(500).json({ error: "Server error" });
//   } finally {
//     if (connection) connection.release();
//   }
// };

// PUT UPDATE

export const handleGetBasedListUser = async (req, res, connection) => {
  const { id } = req.params; // store_id from request
  const { userId } = req.query; // Exclude the current user ID

  try {
    await connection.beginTransaction();

    // Check if the store exists
    const checkQuery = `
      SELECT id FROM Stores WHERE id = ? LIMIT 1
    `;
    const [existingStore] = await connection.execute(checkQuery, [id]);

    if (existingStore.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Store not found.",
      });
    }

    // Fetch users associated with the store, excluding 'Customer', 'Administrator', and the current user
    const getQuery = `
      SELECT 
        ua.id AS user_id,
        ua.store_id,
        ua.username,
        ua.email,
        ua.mobile_number,
        ua.first_name,
        ua.middle_name,
        ua.last_name,
        CONCAT(ua.first_name, ' ', COALESCE(ua.middle_name, ''), ' ', ua.last_name) AS full_name,
        ua.isOnline,
        CASE 
          WHEN ua.isStatus = 1 THEN 'Active'
          WHEN ua.isStatus = 0 THEN 'Deactivated'
        END AS status,
        ua.isArchive,
        ua.date_created,
        rp.role_name,
        rp.can_read,
        rp.can_write,
        rp.can_edit,
        rp.can_delete
      FROM User_Account ua
      LEFT JOIN Roles_Permissions rp ON ua.role_permissions_id = rp.id
      WHERE ua.store_id = ?  
        AND ua.user_type NOT IN ('Customer', 'Administrator') 
        AND ua.isArchive = 0
        AND ua.id != ?;
    `;

    const [users] = await connection.execute(getQuery, [id, userId]);

    await connection.commit();

    return res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    await connection.rollback();
    res.status(500).json({ error: "Server error" });
  } finally {
    if (connection) connection.release();
  }
};

export const handleUpdateAdminBasedUser = async (req, res, connection) => {
  const { id } = req.params;
  const {
    activity_id,
    activity_username,
    activity_roleName,
    store_id,
    role_permissions_id,
    username,
    mobile_number,
    email,
    first_name,
    middle_name,
    last_name,
    isStatus,
  } = req.body;

  try {
    await connection.beginTransaction();

    const checkQuery = `
     SELECT id FROM User_Account 
     WHERE username = ? AND isArchive = 0 AND id != ?
   `;
    const [existingUser] = await connection.query(checkQuery, [username, id]);

    if (existingUser.length > 0) {
      return res.json({ success: false, message: "Username already exists." });
    }

    const getRoleQuery = `
      SELECT role_name 
      FROM Roles_Permissions 
      WHERE id = ?
    `;
    const [roleResult] = await connection.query(getRoleQuery, [
      role_permissions_id,
    ]);

    if (roleResult.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Role not found." });
    }

    const role_name = roleResult[0].role_name;

    const updateQuery = `
      UPDATE User_Account 
      SET 
        store_id = ?,
        role_permissions_id = ?,
        username = ?,
        email = ?,
        mobile_number = ?,
        first_name = ?,
        middle_name = ?,
        last_name = ?,
        user_type = ?,
        isStatus = ?
      WHERE id = ?
    `;

    const params = [
      store_id,
      role_permissions_id,
      username,
      email,
      mobile_number,
      first_name,
      middle_name,
      last_name,
      role_name,
      isStatus,
      id,
    ];

    await connection.query(updateQuery, params);

    const actionType = ActionTypes.USER_MANAGEMENT;
    const actionDescription = ActionDescriptions[actionType].UPDATE_USER(
      activity_username,
      username
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
      .json({ success: true, message: "User updated successfully." });
  } catch (error) {
    await connection.rollback();
    console.error("Error updating user:", error);
    res
      .status(500)
      .json({ error: "An error occurred while updating the user." });
  } finally {
    if (connection) connection.release();
  }
};

export const handleUpdatePermissions = async (req, res, connection) => {
  const { id } = req.params;
  const {
    activity_id,
    activity_username,
    activity_roleName,
    permissionsStatus,
  } = req.body;

  try {
    await connection.beginTransaction();

    const updateQuery = `
      UPDATE Roles_Permissions 
      SET 
        can_read = ?,
        can_write = ?,
        can_edit = ?,
        can_delete = ?
      WHERE id = ? AND isArchive = 0;
    `;

    const permissions = [
      permissionsStatus.Read ? 1 : 0,
      permissionsStatus.Write ? 1 : 0,
      permissionsStatus.Edit ? 1 : 0,
      permissionsStatus.Delete ? 1 : 0,
      id,
    ];

    const [result] = await connection.execute(updateQuery, permissions);

    if (result.affectedRows > 0) {
      const actionType = ActionTypes.USER_MANAGEMENT;
      const actionDescription =
        ActionDescriptions[actionType].UPDATE_PERMISSION(activity_username);

      await logActivity(
        connection,
        activity_id,
        activity_roleName,
        actionType,
        actionDescription
      );
      await connection.commit();
      return res
        .status(200)
        .json({ success: true, message: "Permissions updated successfully." });
    } else {
      await connection.rollback();
      return res.status(404).json({
        success: false,
        message: "Role permissions not found or already archived.",
      });
    }
  } catch (error) {
    await connection.rollback();
    console.error("Error updating permissions:", error);
    res
      .status(500)
      .json({ error: "An error occurred while updating the permissions." });
  } finally {
    if (connection) connection.release();
  }
};

// #REMOVE UPDATE
export const handleUpdateRemoveUser = async (req, res, connection) => {
  const { id } = req.params;
  const { activity_id, activity_username, activity_roleName } = req.body;

  try {
    await connection.beginTransaction();

    const getUsernameQuery = `SELECT username FROM User_Account WHERE id = ?`;
    const [userResult] = await connection.query(getUsernameQuery, [id]);

    if (userResult.length > 0) {
      const username = userResult[0].username;

      const updateQuery = `
        UPDATE User_Account 
        SET isArchive = 1 
        WHERE id = ?
      `;
      const [result] = await connection.query(updateQuery, [id]);

      if (result.affectedRows > 0) {
        const actionType = ActionTypes.USER_MANAGEMENT;
        const actionDescription = ActionDescriptions[actionType].DELETE_USER(
          activity_username,
          username
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
          .json({ success: true, message: "User removed successfully." });
      } else {
        await connection.rollback();
        res.status(404).json({ success: false, message: "User not found." });
      }
    } else {
      throw new Error("User not found.");
    }
  } catch (error) {
    await connection.rollback();
    console.error("Error removing user:", error);
    res
      .status(500)
      .json({ error: "An error occurred while removing the user." });
  } finally {
    if (connection) connection.release();
  }
};
