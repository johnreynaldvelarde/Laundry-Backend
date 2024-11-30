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

const tokenBlacklist = new Set();

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
       WHERE BINARY ua.username = ? 
         AND ua.isArchive = 0`,
      [username]
    );

    
    if (userAccountResults.length === 0 || userAccountResults[0].isStatus === 0 ) {
      await db.rollback();
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (userAccountResults[0].user_type === 'Delivery Staff') {
      await db.rollback();
      return res.status(404).json({
        success: false,
        message: "User account is not available on the website",
      });
    }

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

      const actionType = ActionTypes.AUTHENTICATION;
      const actionDescription = ActionDescriptions[actionType].LOGIN(username);

      await logActivity(db, user.id, roleName, actionType, actionDescription);

      userType = user.user_type;
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

    return res.status(200).json({
      success: true,
      userId: user.id,
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
      `INSERT INTO Customer (id, c_firstname, c_middlename, c_lastname, c_username, c_number, c_email, isAgreement, isStatus, date_created)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1, NOW())`,
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

export const handleLogout = async (req, res, db) => {
  const { user_id, username, roleName } = req.body;

  const actionType = ActionTypes.AUTHENTICATION;
  const actionDescription = ActionDescriptions[actionType].LOGOUT(username);

  await logActivity(db, user_id, roleName, actionType, actionDescription);

  try {
    const refreshToken = req.cookies.refreshToken;

    if (refreshToken) {
      tokenBlacklist.add(refreshToken);
      res.clearCookie("refreshToken");
    }

    res.status(200).json({ success: true, message: "Logged out successfully" });
  } catch (err) {
    console.error("Error during logout:", err);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

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

  // Check for the presence of the Authorization header
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];
  const decoded = decodeToken(token);

  // Verify the decoded token
  if (!decoded) {
    return res.status(401).json({ success: false, message: "Invalid token" });
  }

  const { userId } = decoded;

  try {
    const [userAccountResults] = await db.query(
      `SELECT ua.*, 
              rp.role_name, 
              rp.can_read, 
              rp.can_write, 
              rp.can_edit, 
              rp.can_delete, 
              a.address_line, 
              a.country, 
              a.region, 
              a.province, 
              a.city, 
              a.postal_code, 
              a.latitude, 
              a.longitude 
       FROM User_Account ua 
       LEFT JOIN Roles_Permissions rp ON ua.role_permissions_id = rp.id 
       LEFT JOIN Addresses a ON ua.address_id = a.id 
       WHERE ua.id = ?`,
      [userId]
    );

    if (userAccountResults.length > 0) {
      const user = userAccountResults[0];

      const response = {
        success: true,
        user: {
          userId: user.id,
          storeId: user.store_id,
          addressId: user.address_id,
          firstname: user.first_name,
          middlename: user.middle_name,
          lastname: user.last_name,
          email: user.email,
          phone: user.mobile_number,
          fullName: `${user.first_name} ${
            user.middle_name ? user.middle_name + " " : ""
          }${user.last_name}`,
          username: user.username,
          userType: user.user_type,
          address: {
            addressLine: user.address_line,
            country: user.country,
            region: user.region,
            province: user.province,
            city: user.city,
            postalCode: user.postal_code,
            latitude: user.latitude,
            longitude: user.longitude,
          },
        },
      };

      // If user type is not 'Customer', add role permissions
      if (user.user_type !== "Customer") {
        response.user.roleName = user.role_name || null;
        response.user.permissions = {
          canRead: user.can_read || false,
          canWrite: user.can_write || false,
          canEdit: user.can_edit || false,
          canDelete: user.can_delete || false,
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
