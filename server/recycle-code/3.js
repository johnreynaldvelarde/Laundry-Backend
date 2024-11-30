// Dependencies
const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt'); // For hashing passwords

const app = express();
const port = 3002;

// Middleware
app.use(cors()); // Enable CORS
app.use(bodyParser.json()); // Parse JSON request bodies

// Database configuration
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'lizaso_db'
});

// Connect to the database
db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    process.exit(1); // Exit the process if connection fails
  }
  console.log('Connected to the database.');
});

// Function to create the main store if it doesn't exist
const createMainStore = async () => {
  const storeQuery = 'SELECT COUNT(*) AS count FROM Stores WHERE is_main_store = TRUE';
  db.query(storeQuery, (err, results) => {
    if (err) throw err;

    const storeCount = results[0].count;
    if (storeCount === 0) {
      // Create the main store
      const storeId = 'LIZASO001';
      const storeName = 'Main Store';
      const storeAddress = 'Lizaso Main Store';
      const storeContact = '1234567890';

      const insertStoreQuery = `INSERT INTO Stores 
        (store_id, store_name, store_address, store_contact, is_main_store, date_created, isStatus, isArchive) 
        VALUES (?, ?, ?, ?, TRUE, NOW(), TRUE, FALSE)`;

      db.query(insertStoreQuery, [storeId, storeName, storeAddress, storeContact], (err, storeResults) => {
        if (err) throw err;

        const storeId = storeResults.insertId;
        console.log('Main store created with ID:', storeId);

        // After creating the main store, create the default admin account
        createDefaultAdmin(storeId);
      });
    } else {
      console.log('Main store already exists.');
    }
  });
};

// Function to create a default admin account related to the main store
const createDefaultAdmin = async (storeId) => {
  const query = 'SELECT COUNT(*) AS count FROM User_Account WHERE store_id = ?';
  db.query(query, [storeId], async (err, results) => {
    if (err) throw err;

    const userCount = results[0].count;
    if (userCount === 0) {
      const username = 'admin';
      const firstName = 'Admin';
      const lastName = 'User';
      const email = 'admin@example.com';
      const password = 'admin123';  // Default password
      const hashedPassword = await bcrypt.hash(password, 10);
      const passwordSalt = await bcrypt.genSalt(10);

      // Insert into User_Account
      const insertAccountQuery = `INSERT INTO User_Account 
        (store_id, username, first_name, last_name, email, isRole, isOnline, isStatus, date_created) 
        VALUES (?, ?, ?, ?, ?, 0, FALSE, TRUE, NOW())`;

      db.query(insertAccountQuery, [storeId, username, firstName, lastName, email], (err, accountResults) => {
        if (err) throw err;

        const userId = accountResults.insertId;

        // Insert into User_Security
        const insertSecurityQuery = `INSERT INTO User_Security 
          (user_id, password, password_salt, mfa_enabled, failed_login_attempts, account_locked) 
          VALUES (?, ?, ?, FALSE, 0, FALSE)`;

        db.query(insertSecurityQuery, [userId, hashedPassword, passwordSalt], (err, securityResults) => {
          if (err) throw err;
          console.log('Default admin account created.');
        });
      });
    }
  });
};

// Call the function to create the main store if necessary
createMainStore();

// Server-side route handling login
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Check in User_Account table
  const userAccountQuery = 'SELECT * FROM User_Account WHERE username = ?';
  db.query(userAccountQuery, [username], async (err, userAccountResults) => {
    if (err) return res.status(500).json({ success: false, message: 'Database error' });

    if (userAccountResults.length > 0) {
      const user = userAccountResults[0];

      // Check the password
      const userSecurityQuery = 'SELECT * FROM User_Security WHERE user_id = ?';
      db.query(userSecurityQuery, [user.id], async (err, secResults) => {
        if (err) return res.status(500).json({ success: false, message: 'Database error' });

        if (secResults.length > 0) {
          const userSecurity = secResults[0];
          const passwordMatch = await bcrypt.compare(password, userSecurity.password);

          if (passwordMatch) {
            // Determine user type
            const userType = user.isRole === 0 ? 'Admin' : (user.isRole === 1 ? 'User' : 'Delivery');
            res.json({ success: true, userType });
          } else {
            res.json({ success: false, message: 'Invalid username or password.' });
          }
        } else {
          res.json({ success: false, message: 'User not found.' });
        }
      });
    } else {
      // Check in Customers table if not found in User_Account
      const customerQuery = 'SELECT * FROM Customers WHERE c_username = ?';
      db.query(customerQuery, [username], async (err, customerResults) => {
        if (err) return res.status(500).json({ success: false, message: 'Database error' });

        if (customerResults.length > 0) {
          const customer = customerResults[0];

          // Check the password
          const passwordMatch = await bcrypt.compare(password, customer.c_password);

          if (passwordMatch) {
            res.json({ success: true, userType: 'Customer' });
          } else {
            res.json({ success: false, message: 'Invalid username or password.' });
          }
        } else {
          res.json({ success: false, message: 'User not found.' });
        }
      });
    }
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
