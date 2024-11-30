import jwt from "jsonwebtoken";
import {
  hashPassword,
  comparePassword,
  generatePasswordSalt,
} from "../helpers/auth.js";
import { ActionDescriptions, ActionTypes } from "../helpers/activityLog.js";
import { logActivity } from "./useExtraSystem.js";
import { generateBigIntCustomerId } from "../helpers/generateCode.js";

const createToken = (payload, secret, expiresIn) => {
  return jwt.sign(payload, secret, { expiresIn });
};

export const handleLogin = async (req, res, db) => {
  const { username, password } = req.body;

  try {
    let user, userType, roleName, permissions;

    const [userAccountResults] = await db.query(
      `SELECT 
          ua.*, 
          rp.role_name, 
          rp.can_read, 
          rp.can_write, 
          rp.can_edit, 
          rp.can_delete 
       FROM User_Account ua
       LEFT JOIN Roles_Permissions rp ON ua.role_permissions_id = rp.id
       WHERE ua.username = ? AND ua.isStatus = 1 AND ua.isArchive = 0`,
      [username]
    );

    if (userAccountResults.length > 0) {
      user = userAccountResults[0];
      const [secResults] = await db.query(
        "SELECT * FROM User_Security WHERE user_id = ?",
        [user.id]
      );

      if (secResults.length === 0) {
        return res.status(404).json({
          success: false,
          message: "User security details not found.",
        });
      }

      const userSecurity = secResults[0];
      const passwordMatch = await comparePassword(
        password,
        userSecurity.password
      );

      if (!passwordMatch) {
        return res
          .status(401)
          .json({ success: false, message: "Invalid username or password." });
      }

      // Get role name and permissions
      roleName = user.role_name;
      permissions = {
        can_read: user.can_read,
        can_write: user.can_write,
        can_edit: user.can_edit,
        can_delete: user.can_delete,
      };

      // Update isOnline status to 1
      await db.query("UPDATE User_Account SET isOnline = 1 WHERE id = ?", [
        user.id,
      ]);

      // const actionType = ActionTypes.AUTHENTICATION;
      // const actionDescription = ActionDescriptions[actionType].LOGIN(username);

      // await logActivity(db, user.id, roleName, actionType, actionDescription);

      // Set user type based on the user_type field
      userType = user.user_type; // Assuming user_type distinguishes between roles
    } else {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }

    // Generate JWT tokens
    const accessToken = createToken(
      { userId: user.id, username, userType, roleName, permissions },
      process.env.ACCESS_TOKEN_SECRET,
      Number(process.env.JWT_EXPIRES_IN)
    );

    const refreshToken = createToken(
      { userId: user.id, username, userType, roleName, permissions },
      process.env.REFRESH_TOKEN_SECRET,
      Number(process.env.JWT_REFRESH_EXPIRES_IN)
    );

    // Set the refresh token in an HTTP-only cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Set to true if using HTTPS
      sameSite: "Strict", // Adjust as needed
    });

    // Respond with access token, user type, role name, and permissions
    return res.status(200).json({
      success: true,
      userType,
      roleName,
      permissions,
      accessToken,
    });
  } catch (err) {
    console.error("Error handling login:", err);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

// export const handleLogin = async (req, res, db) => {
//   const { username, password } = req.body;
//   try {
//     let user, userType, roleName, permissions;

//     // Check User_Account table first
//     const [userAccountResults] = await db.query(
//       `SELECT ua.*, rp.role_name,
//               rp.can_read, rp.can_write, rp.can_edit, rp.can_delete
//        FROM User_Account ua
//        JOIN Roles_Permissions rp ON ua.role_permissions_id = rp.id
//        WHERE ua.username = ?`,
//       [username]
//     );

//     if (userAccountResults.length > 0) {
//       user = userAccountResults[0];
//       const [secResults] = await db.query(
//         "SELECT * FROM User_Security WHERE user_id = ?",
//         [user.id]
//       );

//       if (secResults.length === 0) {
//         return res.status(404).json({
//           success: false,
//           message: "User security details not found.",
//         });
//       }

//       const userSecurity = secResults[0];
//       const passwordMatch = await comparePassword(
//         password,
//         userSecurity.password
//       );

//       if (!passwordMatch) {
//         return res
//           .status(401)
//           .json({ success: false, message: "Invalid username or password." });
//       }

//       // Get role name and permissions
//       roleName = user.role_name;
//       permissions = {
//         can_read: user.can_read,
//         can_write: user.can_write,
//         can_edit: user.can_edit,
//         can_delete: user.can_delete,
//       };

//       // Update isOnline status to 1
//       await db.query("UPDATE User_Account SET isOnline = 1 WHERE id = ?", [
//         user.id,
//       ]);

//       const actionType = ActionTypes.AUTHENTICATION;
//       const actionDescription = ActionDescriptions[actionType].LOGIN(username);

//       await logActivity(db, user.id, roleName, actionType, actionDescription);
//     } else {
//       // If not in User_Account, check Customers table
//       const [customerAccountResults] = await db.query(
//         "SELECT * FROM Customer WHERE c_username = ?",
//         [username]
//       );

//       if (customerAccountResults.length === 0) {
//         return res
//           .status(404)
//           .json({ success: false, message: "User not found." });
//       }

//       user = customerAccountResults[0];

//       const [secCustomerResults] = await db.query(
//         "SELECT * FROM Customer_Security WHERE customer_id = ?",
//         [user.id]
//       );

//       if (secCustomerResults.length === 0) {
//         return res.status(404).json({
//           success: false,
//           message: "Customer security details not found.",
//         });
//       }

//       const customerSecurity = secCustomerResults[0];
//       const passwordMatch = await comparePassword(
//         password,
//         customerSecurity.c_password
//       );

//       if (!passwordMatch) {
//         return res
//           .status(401)
//           .json({ success: false, message: "Invalid username or password." });
//       }

//       // Set user type for customers
//       userType = "Customer";

//       // Update isOnline status to 1
//       await db.query("UPDATE Customer SET isOnline = 1 WHERE id = ?", [
//         user.id,
//       ]);
//     }

//     // Generate JWT tokens
//     const accessToken = createToken(
//       { userId: user.id, username, userType, roleName, permissions },
//       process.env.ACCESS_TOKEN_SECRET,
//       process.env.JWT_EXPIRES_IN
//     );

//     const refreshToken = createToken(
//       { userId: user.id, username, userType, roleName, permissions },
//       process.env.REFRESH_TOKEN_SECRET,
//       process.env.JWT_REFRESH_EXPIRES_IN
//     );

//     // Set the refresh token in an HTTP-only cookie
//     res.cookie("refreshToken", refreshToken, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === "production", // Set to true if using HTTPS
//       sameSite: "Strict", // Adjust as needed
//     });

//     // Respond with access token, user type, role name, and permissions
//     return res.status(200).json({
//       success: true,
//       userType,
//       roleName,
//       permissions,
//       accessToken,
//     });
//   } catch (err) {
//     console.error("Error handling login:", err);
//     return res
//       .status(500)
//       .json({ success: false, message: "Internal Server Error" });
//   }
// };

// export const handleLogin = async (req, res, db) => {
//   const { username, password } = req.body;
//   try {
//     let user, userType, roleName, permissions;

//     // Check User_Account table first
//     const [userAccountResults] = await db.query(
//       `SELECT ua.*, rp.role_name,
//               rp.can_read, rp.can_write, rp.can_edit, rp.can_delete
//        FROM User_Account ua
//        JOIN Roles_Permissions rp ON ua.role_permissions_id = rp.id
//        WHERE ua.username = ?`,
//       [username]
//     );

//     if (userAccountResults.length > 0) {
//       user = userAccountResults[0];
//       const [secResults] = await db.query(
//         "SELECT * FROM User_Security WHERE user_id = ?",
//         [user.id]
//       );

//       if (secResults.length === 0) {
//         return res.status(404).json({
//           success: false,
//           message: "User security details not found.",
//         });
//       }

//       const userSecurity = secResults[0];
//       const passwordMatch = await comparePassword(
//         password,
//         userSecurity.password
//       );

//       if (!passwordMatch) {
//         return res
//           .status(401)
//           .json({ success: false, message: "Invalid username or password." });
//       }

//       // Get role name and permissions
//       roleName = user.role_name;
//       permissions = {
//         can_read: user.can_read,
//         can_write: user.can_write,
//         can_edit: user.can_edit,
//         can_delete: user.can_delete,
//       };

//       // Update isOnline status to 1
//       await db.query("UPDATE User_Account SET isOnline = 1 WHERE id = ?", [
//         user.id,
//       ]);

//       const actionType = ActionTypes.AUTHENTICATION;
//       const actionDescription = ActionDescriptions[actionType].LOGIN(username);

//       await logActivity(db, user.id, roleName, actionType, actionDescription);
//     } else {
//       // If not in User_Account, check Customers table
//       const [customerAccountResults] = await db.query(
//         "SELECT * FROM Customer WHERE c_username = ?",
//         [username]
//       );

//       if (customerAccountResults.length === 0) {
//         return res
//           .status(404)
//           .json({ success: false, message: "User not found." });
//       }

//       user = customerAccountResults[0];

//       const [secCustomerResults] = await db.query(
//         "SELECT * FROM Customer_Security WHERE customer_id = ?",
//         [user.id]
//       );

//       if (secCustomerResults.length === 0) {
//         return res.status(404).json({
//           success: false,
//           message: "Customer security details not found.",
//         });
//       }

//       const customerSecurity = secCustomerResults[0];
//       const passwordMatch = await comparePassword(
//         password,
//         customerSecurity.c_password
//       );

//       if (!passwordMatch) {
//         return res
//           .status(401)
//           .json({ success: false, message: "Invalid username or password." });
//       }

//       // Set user type for customers
//       userType = "Customer";

//       // Update isOnline status to 1
//       await db.query("UPDATE Customer SET isOnline = 1 WHERE id = ?", [
//         user.id,
//       ]);
//     }

//     // Generate JWT tokens
//     const accessToken = createToken(
//       { userId: user.id, username, userType, roleName, permissions },
//       process.env.ACCESS_TOKEN_SECRET,
//       process.env.JWT_EXPIRES_IN
//     );

//     const refreshToken = createToken(
//       { userId: user.id, username, userType, roleName, permissions },
//       process.env.REFRESH_TOKEN_SECRET,
//       process.env.JWT_REFRESH_EXPIRES_IN
//     );

//     // Set the refresh token in an HTTP-only cookie
//     res.cookie("refreshToken", refreshToken, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === "production", // Set to true if using HTTPS
//       sameSite: "Strict", // Adjust as needed
//     });

//     // Respond with access token, user type, role name, and permissions
//     return res.status(200).json({
//       success: true,
//       userType,
//       roleName,
//       permissions,
//       accessToken,
//     });
//   } catch (err) {
//     console.error("Error handling login:", err);
//     return res
//       .status(500)
//       .json({ success: false, message: "Internal Server Error" });
//   }
// };

export const handleRegister = async (req, res, db) => {
  const {
    c_firstname,
    c_middlename,
    c_lastname,
    c_username,
    c_password,
    isAgreement,
    c_email,
    c_number,
  } = req.body;

  const newCustomerId = generateBigIntCustomerId();

  try {
    const hashedPassword = await hashPassword(c_password);
    const passwordSalt = await generatePasswordSalt();

    await db.beginTransaction();

    // Insert customer into Customers table
    const [customerResult] = await db.query(
      `INSERT INTO Customer (id, c_firstname, c_middlename, c_lastname, c_username, c_number, c_email, isAgreement, date_created)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
      [
        newCustomerId,
        c_firstname,
        c_middlename,
        c_lastname,
        c_username,
        c_number,
        c_email,
        isAgreement,
      ]
    );

    const [securityResult] = await db.query(
      `INSERT INTO Customer_Security (customer_id, c_password, c_password_salt, mfa_enabled, failed_login_attempts, account_locked, last_login, last_logout, last_password_change)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        newCustomerId,
        hashedPassword,
        passwordSalt,
        false,
        0,
        false,
        null,
        null,
        null,
      ]
    );

    if (securityResult.affectedRows === 0) {
      throw new Error("Failed to insert customer security data");
    }

    await db.commit();
    res
      .status(201)
      .json({ success: true, message: "Customer registered successfully" });
  } catch (error) {
    await db.rollback();

    console.error("Error registering customer:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Working
export const handleRefreshToken = async (req, res) => {
  const { refreshToken } = req.cookies;

  if (!refreshToken) {
    return res
      .status(401)
      .json({ success: false, message: "No refresh token provided." });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const newAccessToken = createToken(
      { userId: decoded.userId },
      process.env.ACCESS_TOKEN_SECRET,
      Number(process.env.JWT_EXPIRES_IN)
    );

    return res.status(200).json({ success: true, accessToken: newAccessToken });
  } catch (err) {
    console.error("Error verifying refresh token:", err);
    return res
      .status(403)
      .json({ success: false, message: "Invalid refresh token." });
  }
};

// Utility function to decode the token
const decodeToken = (token) => {
  try {
    return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  } catch (err) {
    return null;
  }
};

// Revised getUserDetails function
export const getUserDetails = async (req, res, db) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];
  const decoded = decodeToken(token);

  if (!decoded) {
    return res.status(401).json({ success: false, message: "Invalid token" });
  }

  const { userId } = decoded; // Assuming the userId is included in the token

  try {
    // First, get the user account details, including the user type
    const [userAccountResults] = await db.query(
      `SELECT ua.*, rp.role_name, rp.can_read, rp.can_write, rp.can_edit, rp.can_delete 
       FROM User_Account ua 
       LEFT JOIN Roles_Permissions rp ON ua.role_permissions_id = rp.id 
       WHERE ua.id = ?`,
      [userId]
    );

    if (userAccountResults.length > 0) {
      const user = userAccountResults[0];

      // Prepare the response based on user type
      const response = {
        success: true,
        user: {
          userId: user.id,
          storeId: user.store_id,
          firstname: user.first_name,
          middlename: user.middle_name,
          lastname: user.last_name,
          email: user.email,
          phone: user.mobile_number,
          fullName: `${user.first_name} ${user.last_name}`,
          username: user.username,
          userType: user.user_type, // Include user type in response
        },
      };

      // If user type is not 'Customer', add role permissions
      if (user.user_type !== "Customer") {
        response.user.roleName = user.role_name;
        response.user.permissions = {
          canRead: user.can_read,
          canWrite: user.can_write,
          canEdit: user.can_edit,
          canDelete: user.can_delete,
        };
      }

      return res.status(200).json(response);
    } else {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
  } catch (error) {
    console.error("Error fetching user details:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// export const getUserDetails = async (req, res, db) => {
//   const authHeader = req.headers.authorization;

//   if (!authHeader || !authHeader.startsWith("Bearer ")) {
//     return res.status(401).json({ success: false, message: "Unauthorized" });
//   }

//   const token = authHeader.split(" ")[1];
//   const decoded = decodeToken(token);

//   if (!decoded) {
//     return res.status(401).json({ success: false, message: "Invalid token" });
//   }

//   const { userId } = decoded;

//   console.log(userId);

//   try {
//     const [userAccountResults] = await db.query(
//       `SELECT ua.*,
//               rp.role_name,
//               rp.can_read,
//               rp.can_write,
//               rp.can_edit,
//               rp.can_delete
//        FROM User_Account ua
//        JOIN Roles_Permissions rp ON ua.role_permissions_id = rp.id
//        WHERE ua.id = ?`,
//       [userId] // Only use userId to find the account
//     );

//     if (userAccountResults.length > 0) {
//       const user = userAccountResults[0];
//       return res.status(200).json({
//         success: true,
//         user: {
//           userId: user.id,
//           storeId: user.store_id,
//           firstname: user.first_name,
//           middlename: user.middle_name,
//           lastname: user.last_name,
//           email: user.email,
//           phone: user.mobile_number,
//           fullName: `${user.first_name} ${user.last_name}`,
//           username: user.username,
//           roleName: user.role_name,
//           permissions: {
//             canRead: user.can_read,
//             canWrite: user.can_write,
//             canEdit: user.can_edit,
//             canDelete: user.can_delete,
//           },
//         },
//       });
//     } else {
//       return res
//         .status(404)
//         .json({ success: false, message: "User not found" });
//     }
//   } catch (error) {
//     console.error("Error fetching user details:", error);
//     return res.status(500).json({ success: false, message: "Server error" });
//   }
// };

// export const getUserDetails = async (req, res, db) => {
//   const authHeader = req.headers.authorization;

//   if (!authHeader || !authHeader.startsWith("Bearer ")) {
//     return res.status(401).json({ success: false, message: "Unauthorized" });
//   }

//   const token = authHeader.split(" ")[1];
//   const decoded = decodeToken(token);

//   if (!decoded) {
//     return res.status(401).json({ success: false, message: "Invalid token" });
//   }

//   const { userId, username } = decoded;

//   try {

//     const [userAccountResults] = await db.query(
//       `SELECT ua.*,
//               rp.role_name,
//               rp.can_read,
//               rp.can_write,
//               rp.can_edit,
//               rp.can_delete
//        FROM User_Account ua
//        JOIN Roles_Permissions rp ON ua.role_permissions_id = rp.id
//        WHERE ua.id = ? AND ua.username = ?`,
//       [userId, username]
//     );

//     if (userAccountResults.length > 0) {
//       const user = userAccountResults[0];
//       return res.status(200).json({
//         success: true,
//         user: {
//           userId: user.id,
//           storeId: user.store_id,
//           firstname: user.first_name,
//           middlename: user.middle_name,
//           lastname: user.last_name,
//           email: user.email,
//           phone: user.mobile_number,
//           fullName: `${user.first_name} ${user.last_name}`,
//           username: user.username,
//           roleName: user.role_name,
//           permissions: {
//             canRead: user.can_read,
//             canWrite: user.can_write,
//             canEdit: user.can_edit,
//             canDelete: user.can_delete,
//           },
//         },
//       });
//     } else {
//       // Check if the customer exists in the Customer table
//       const [customerResults] = await db.query(
//         "SELECT * FROM Customer WHERE id = ?",
//         [userId]
//       );

//       if (customerResults.length > 0) {
//         const customer = customerResults[0];
//         return res.status(200).json({
//           success: true,
//           user: {
//             userId: customer.id,
//             storeId: customer.store_id,
//             fullName: `${customer.c_firstname} ${customer.c_lastname}`,
//             username: customer.c_username,
//             phone: customer.c_number,
//             userType: "Customer",
//           },
//         });
//       } else {
//         return res
//           .status(404)
//           .json({ success: false, message: "User or Customer not found" });
//       }
//     }
//   } catch (error) {
//     console.error("Error fetching user details:", error);
//     return res.status(500).json({ success: false, message: "Server error" });
//   }
// };

// export const getUserDetails = async (req, res, db) => {
//   const authHeader = req.headers.authorization;

//   if (!authHeader || !authHeader.startsWith("Bearer ")) {
//     return res.status(401).json({ success: false, message: "Unauthorized" });
//   }

//   const token = authHeader.split(" ")[1];
//   const decoded = decodeToken(token);

//   if (!decoded) {
//     return res.status(401).json({ success: false, message: "Invalid token" });
//   }

//   const { userId, username } = decoded;

//   try {

//     const [userAccountResults] = await db.query(
//       `SELECT ua.*,
//               rp.role_name,
//               rp.can_read,
//               rp.can_write,
//               rp.can_edit,
//               rp.can_delete
//        FROM User_Account ua
//        JOIN Roles_Permissions rp ON ua.role_permissions_id = rp.id
//        WHERE ua.id = ? AND ua.username = ?`,
//       [userId, username]
//     );

//     if (userAccountResults.length > 0) {
//       const user = userAccountResults[0];
//       return res.status(200).json({
//         success: true,
//         user: {
//           userId: user.id,
//           storeId: user.store_id,
//           firstname: user.first_name,
//           middlename: user.middle_name,
//           lastname: user.last_name,
//           email: user.email,
//           phone: user.mobile_number,
//           fullName: `${user.first_name} ${user.last_name}`,
//           username: user.username,
//           roleName: user.role_name,
//           permissions: {
//             canRead: user.can_read,
//             canWrite: user.can_write,
//             canEdit: user.can_edit,
//             canDelete: user.can_delete,
//           },
//         },
//       });
//     } else {
//       // Check if the customer exists in the Customer table
//       const [customerResults] = await db.query(
//         "SELECT * FROM Customer WHERE id = ?",
//         [userId]
//       );

//       if (customerResults.length > 0) {
//         const customer = customerResults[0];
//         return res.status(200).json({
//           success: true,
//           user: {
//             userId: customer.id,
//             storeId: customer.store_id,
//             fullName: `${customer.c_firstname} ${customer.c_lastname}`,
//             username: customer.c_username,
//             phone: customer.c_number,
//             userType: "Customer",
//           },
//         });
//       } else {
//         return res
//           .status(404)
//           .json({ success: false, message: "User or Customer not found" });
//       }
//     }
//   } catch (error) {
//     console.error("Error fetching user details:", error);
//     return res.status(500).json({ success: false, message: "Server error" });
//   }
// };

// export const handleLoginMobile = async (req, res, db) => {
//   const { username, password } = req.body;
//   try {
//     let user, userType, roleName, permissions;

//     // Check User_Account table first
//     const [userAccountResults] = await db.query(
//       `SELECT ua.*, rp.role_name,
//               rp.can_read, rp.can_write, rp.can_edit, rp.can_delete
//        FROM User_Account ua
//        JOIN Roles_Permissions rp ON ua.role_permissions_id = rp.id
//        WHERE ua.username = ?`,
//       [username]
//     );

//     if (userAccountResults.length > 0) {
//       user = userAccountResults[0];
//       const [secResults] = await db.query(
//         "SELECT * FROM User_Security WHERE user_id = ?",
//         [user.id]
//       );

//       if (secResults.length === 0) {
//         return res.status(200).json({
//           success: false,
//           message: "User security details not found.",
//         });
//       }

//       const userSecurity = secResults[0];
//       const passwordMatch = await comparePassword(
//         password,
//         userSecurity.password
//       );

//       if (!passwordMatch) {
//         return res
//           .status(200)
//           .json({ success: false, message: "Invalid username or password" });
//       }

//       // Get role name and permissions
//       roleName = user.role_name;
//       permissions = {
//         can_read: user.can_read,
//         can_write: user.can_write,
//         can_edit: user.can_edit,
//         can_delete: user.can_delete,
//       };

//       // Update isOnline status to 1
//       await db.query("UPDATE User_Account SET isOnline = 1 WHERE id = ?", [
//         user.id,
//       ]);

//       const actionType = ActionTypes.AUTHENTICATION;
//       const actionDescription = ActionDescriptions[actionType].LOGIN(username);

//       await logActivity(db, user.id, roleName, actionType, actionDescription);
//     } else {
//       // If not in User_Account, check Customers table
//       const [customerAccountResults] = await db.query(
//         "SELECT * FROM Customer WHERE c_username = ?",
//         [username]
//       );

//       if (customerAccountResults.length === 0) {
//         return res
//           .status(200)
//           .json({ success: false, message: "User not found" });
//       }

//       user = customerAccountResults[0];

//       const [secCustomerResults] = await db.query(
//         "SELECT * FROM Customer_Security WHERE customer_id = ?",
//         [user.id]
//       );

//       if (secCustomerResults.length === 0) {
//         return res.status(404).json({
//           success: false,
//           message: "Customer security details not found.",
//         });
//       }

//       const customerSecurity = secCustomerResults[0];
//       const passwordMatch = await comparePassword(
//         password,
//         customerSecurity.c_password
//       );

//       if (!passwordMatch) {
//         return res
//           .status(401)
//           .json({ success: false, message: "Invalid username or password." });
//       }

//       // Set user type for customers
//       userType = "Customer";

//       // Update isOnline status to 1
//       await db.query("UPDATE Customer SET isOnline = 1 WHERE id = ?", [
//         user.id,
//       ]);
//     }

//     // Generate JWT tokens
//     const accessToken = createToken(
//       { userId: user.id, username, userType, roleName, permissions },
//       process.env.ACCESS_TOKEN_SECRET,
//       process.env.JWT_EXPIRES_IN
//     );
//     const refreshToken = createToken(
//       { userId: user.id, username, userType, roleName, permissions },
//       process.env.REFRESH_TOKEN_SECRET,
//       process.env.JWT_REFRESH_EXPIRES_IN
//     );

//     // Set the refresh token in an HTTP-only cookie
//     res.cookie("refreshToken", refreshToken, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === "production", // Set to true if using HTTPS
//       sameSite: "Strict", // Adjust as needed
//     });

//     // Respond with access token, user type, role name, and permissions
//     return res.status(200).json({
//       success: true,
//       userType,
//       roleName,
//       permissions,
//       accessToken,
//     });
//   } catch (err) {
//     console.error("Error handling login:", err);
//     return res
//       .status(500)
//       .json({ success: false, message: "Internal Server Error" });
//   }
// };
