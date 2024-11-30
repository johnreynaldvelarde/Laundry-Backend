// const bcrypt = require('bcrypt');
// const { getMainStoreId } = require('./storeService');

// const createDefaultAdmin = async (db) => {
//   const query = 'SELECT COUNT(*) AS count FROM User_Account';
//   db.query(query, async (err, results) => {
//     if (err) throw err;

//     const userCount = results[0].count;
//     if (userCount === 0) {
//       const username = 'admin';
//       const firstName = 'Admin';
//       const lastName = 'User';
//       const email = 'admin@example.com';
//       const password = 'admin123';
//       const hashedPassword = await bcrypt.hash(password, 10);
//       const passwordSalt = await bcrypt.genSalt(10);

//       getMainStoreId(db, (storeId) => {
//         if (storeId) {
//           const insertAccountQuery = `INSERT INTO User_Account 
//             (username, first_name, last_name, email, isRole, isOnline, isStatus, date_created, store_id) 
//             VALUES (?, ?, ?, ?, 0, FALSE, TRUE, NOW(), ?)`;

//           db.query(insertAccountQuery, [username, firstName, lastName, email, storeId], (err, accountResults) => {
//             if (err) throw err;

//             const userId = accountResults.insertId;

//             const insertSecurityQuery = `INSERT INTO User_Security 
//               (user_id, password, password_salt, mfa_enabled, failed_login_attempts, account_locked) 
//               VALUES (?, ?, ?, FALSE, 0, FALSE)`;

//             db.query(insertSecurityQuery, [userId, hashedPassword, passwordSalt], (err) => {
//               if (err) throw err;
//               console.log('Default admin account created.');
//             });
//           });
//         } else {
//           console.log('No main store found, cannot create default admin.');
//         }
//       });
//     }
//   });
// };

// const handleLogin = async (req, res, db) => {
//   const { username, password } = req.body;

//   const userAccountQuery = 'SELECT * FROM User_Account WHERE username = ?';
//   db.query(userAccountQuery, [username], async (err, userAccountResults) => {
//     if (err) return res.status(500).json({ success: false, message: 'Database error' });

//     if (userAccountResults.length > 0) {
//       const user = userAccountResults[0];

//       const userSecurityQuery = 'SELECT * FROM User_Security WHERE user_id = ?';
//       db.query(userSecurityQuery, [user.id], async (err, secResults) => {
//         if (err) return res.status(500).json({ success: false, message: 'Database error' });

//         if (secResults.length > 0) {
//           const userSecurity = secResults[0];
//           const passwordMatch = await bcrypt.compare(password, userSecurity.password);

//           if (passwordMatch) {
//             const userType = user.isRole === 0 ? 'Admin' : (user.isRole === 1 ? 'User' : 'Delivery');
//             res.json({ success: true, userType });
//           } else {
//             res.json({ success: false, message: 'Invalid username or password.' });
//           }
//         } else {
//           res.json({ success: false, message: 'User not found.' });
//         }
//       });
//     } else {
//       const customerQuery = 'SELECT * FROM Customers WHERE c_username = ?';
//       db.query(customerQuery, [username], async (err, customerResults) => {
//         if (err) return res.status(500).json({ success: false, message: 'Database error' });

//         if (customerResults.length > 0) {
//           const customer = customerResults[0];
//           const passwordMatch = await bcrypt.compare(password, customer.c_password);

//           if (passwordMatch) {
//             res.json({ success: true, userType: 'Customer' });
//           } else {
//             res.json({ success: false, message: 'Invalid username or password.' });
//           }
//         } else {
//           res.json({ success: false, message: 'User not found.' });
//         }
//       });
//     }
//   });
// };

// module.exports = { createDefaultAdmin, handleLogin };
// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');
// const { getMainStoreId } = require('./storeService');
// const { JWT_SECRET } = require('../config/config');

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { getMainStoreId } from '../../recycle-code/storeService.js'
// import {JWT_SECRET} from '../config/config.js'

export const createDefaultAdmin = async (db) => {
  try {
    const [results] = await db.query('SELECT COUNT(*) AS count FROM User_Account');
    const userCount = results[0].count;

    if (userCount === 0) {
      const username = 'admin';
      const firstName = 'Admin';
      const lastName = 'User';
      const email = 'admin@example.com';
      const password = 'admin123';
      const hashedPassword = await bcrypt.hash(password, 10);
      const passwordSalt = await bcrypt.genSalt(10);

      const storeId = await getMainStoreId(db); // Assume this returns a Promise

      if (storeId) {
        await db.query(`INSERT INTO User_Account 
          (username, first_name, last_name, email, isRole, isOnline, isStatus, date_created, store_id) 
          VALUES (?, ?, ?, ?, 0, FALSE, TRUE, NOW(), ?)`, 
          [username, firstName, lastName, email, storeId]
        );

        const [accountResults] = await db.query(`SELECT LAST_INSERT_ID() AS user_id`);
        const userId = accountResults[0].user_id;

        await db.query(`INSERT INTO User_Security 
          (user_id, password, password_salt, mfa_enabled, failed_login_attempts, account_locked) 
          VALUES (?, ?, ?, FALSE, 0, FALSE)`,
          [userId, hashedPassword, passwordSalt]
        );

        console.log('Default admin account created.');
      } else {
        console.log('No main store found, cannot create default admin.');
      }
    }
  } catch (err) {
    console.error('Error creating default admin:', err);
  }
};



// const handleRegister = async (req, res, db) => {
//   try {
//     const {
//       c_firstname,
//       c_middlename,
//       c_lastname,
//       c_username,
//       c_password,
//       c_number,
//       c_email,
//       isAgreement
//     } = req.body;

//     // Check if the user already exists
//     const [existingUser] = await db.query('SELECT COUNT(*) AS count FROM Customers WHERE c_username = ?', [c_username]);
//     if (existingUser[0].count > 0) {
//       return res.status(400).json({ success: false, message: 'Username is already taken.' });
//     }

//     // Hash the password
//     const hashedPassword = await bcrypt.hash(c_password, 10);

//     // Insert the new customer into the database
//     await db.query(`INSERT INTO Customers 
//       (c_firstname, c_middlename, c_lastname, c_username, c_password, c_number, c_email, isAgreement, isOnline, isArchive, date_created) 
//       VALUES (?, ?, ?, ?, ?, ?, ?, ?, FALSE, FALSE, NOW())`,
//       [c_firstname, c_middlename, c_lastname, c_username, hashedPassword, c_number, c_email, isAgreement]
//     );

//     res.status(201).json({ success: true, message: 'Customer registered successfully.' });

//   } catch (error) {
//     console.error('Error registering customer:', error);
//     res.status(500).json({ success: false, message: 'An error occurred during registration.' });
//   }
// };

// export { createDefaultAdmin, handleLogin};
// module.exports = { createDefaultAdmin, handleLogin };

  // const query = 'SELECT COUNT(*) AS count FROM User_Account';
  // db.query(query, async (err, results) => {
  //   if (err) throw err;

  //   const userCount = results[0].count;
  //   if (userCount === 0) {
  //     const username = 'admin';
  //     const firstName = 'Admin';
  //     const lastName = 'User';
  //     const email = 'admin@example.com';
  //     const password = 'admin123';
  //     const hashedPassword = await bcrypt.hash(password, 10);
  //     const passwordSalt = await bcrypt.genSalt(10);

  //     getMainStoreId(db, (storeId) => {
  //       if (storeId) {
  //         const insertAccountQuery = `INSERT INTO User_Account 
  //           (username, first_name, last_name, email, isRole, isOnline, isStatus, date_created, store_id) 
  //           VALUES (?, ?, ?, ?, 0, FALSE, TRUE, NOW(), ?)`;

  //         db.query(insertAccountQuery, [username, firstName, lastName, email, storeId], (err, accountResults) => {
  //           if (err) throw err;

  //           const userId = accountResults.insertId;

  //           const insertSecurityQuery = `INSERT INTO User_Security 
  //             (user_id, password, password_salt, mfa_enabled, failed_login_attempts, account_locked) 
  //             VALUES (?, ?, ?, FALSE, 0, FALSE)`;

  //           db.query(insertSecurityQuery, [userId, hashedPassword, passwordSalt], (err) => {
  //             if (err) throw err;
  //             console.log('Default admin account created.');
  //           });
  //         });
  //       } else {
  //         console.log('No main store found, cannot create default admin.');
  //       }
  //     });
  //   }
  // });

