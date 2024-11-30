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


// Function to create default admin account
const createDefaultAdmin = async () => {
  const query = 'SELECT COUNT(*) AS count FROM User_Account';
  db.query(query, async (err, results) => {
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
        (username, first_name, last_name, email, isRole, isOnline, isStatus, date_created) 
        VALUES (?, ?, ?, ?, 0, FALSE, TRUE, NOW())`;

      db.query(insertAccountQuery, [username, firstName, lastName, email], (err, accountResults) => {
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

// Call the function to create the default admin account if necessary
createDefaultAdmin();



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



// // User login route
// app.post('/login', (req, res) => {
//   const { username, password } = req.body;

//   const query = `SELECT UA.id, UA.username, US.password 
//                  FROM User_Account UA 
//                  JOIN User_Security US ON UA.id = US.user_id 
//                  WHERE UA.username = ?`;

//   db.query(query, [username], async (err, results) => {
//     if (err) return res.status(500).json({ error: 'Database query failed' });

//     if (results.length === 0) {
//       return res.status(401).json({ error: 'Invalid username or password' });
//     }

//     const user = results[0];
//     const validPassword = await bcrypt.compare(password, user.password);

//     if (!validPassword) {
//       return res.status(401).json({ error: 'Invalid username or password' });
//     }

//     // Successful login
//     const updateLastLoginQuery = `UPDATE User_Security SET last_login = NOW() WHERE user_id = ?`;
//     db.query(updateLastLoginQuery, [user.id], (err, updateResults) => {
//       if (err) return res.status(500).json({ error: 'Failed to update login time' });

//       res.json({ success: true, message: 'Login successful' });
//     });
//   });
// });


// // Define routes
// app.post('/User_Account', (req, res) => {

//   const { username, password } = req.body;

//   const query = `
//     SELECT ua.id, us.password, us.account_locked
//     FROM User_Account ua
//     JOIN User_Security us ON ua.id = us.user_id
//     WHERE ua.username = ? OR ua.email = ?
//   `;

//   db.query(query, [username, username], async (err, results) => {
//     if (err) return res.status(500).json({ success: false, message: 'Database error' });

//     if (results.length > 0) {
//       const user = results[0];

//       if (user.account_locked) {
//         return res.json({ success: false, message: 'Account is locked due to too many failed login attempts.' });
//       }

//       const match = await bcrypt.compare(password, user.password);

//       if (match) {
//         res.json({ success: true, message: 'Login successful' });
//         // Update last_login in User_Security
//         const updateLoginQuery = 'UPDATE User_Security SET last_login = NOW() WHERE user_id = ?';
//         db.query(updateLoginQuery, [user.id]);
//       } else {
//         res.json({ success: false, message: 'Invalid username or password' });
//         // Handle failed login attempt, update User_Security table
//         const updateFailedAttemptsQuery = `
//           UPDATE User_Security 
//           SET failed_login_attempts = failed_login_attempts + 1 
//           WHERE user_id = ?
//         `;
//         db.query(updateFailedAttemptsQuery, [user.id], (err) => {
//           if (err) throw err;
//         });
//       }
//     } else {
//       res.json({ success: false, message: 'Invalid username or password' });
//     }
//   });
// });

// Gracefully close the connection when exiting the application
process.on('SIGINT', () => {
  db.end((err) => {
    if (err) {
      console.error('Error closing the database connection:', err);
    } else {
      console.log('Database connection closed.');
    }
    process.exit(0);
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});


// app.get('/User_Account', (req, res) => {
//   const sql = "SELECT * FROM User_Account";
//   db.query(sql, (err, data) => {
//     if (err) {
//       console.error(err);
//       return res.status(500).json({ message: 'Error fetching data from the database.' });
//     }
//     res.json(data);
//   });
// });


// // Define routes
// app.get('/', (req, res) => {
//   res.json("From backend side");
// });


// // for creating an account
// app.post('/Users_Account', (req, res) => {
//   const { firstName, middleName, lastName, userName, password, isAgreement } = req.body;

//   // Validate request data
//   if (!firstName || !lastName || !userName || !password || typeof isAgreement !== 'boolean') {
//     return res.status(400).json({ message: 'Please provide all required fields.' });
//   }

//   // Hash the password before storing it
//   bcrypt.hash(password, 10, (err, hashedPassword) => {
//     if (err) {
//       console.error(err);
//       return res.status(500).json({ message: 'Error hashing password.' });
//     }

//     // Insert data into the database
//     const sql = `
//       INSERT INTO User_Account (first_name, middle_name, last_name, username, password, isAgreement, user_type, isOnline, isArchive, date_created)
//       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
//     `;

//     const values = [
//       firstName,
//       middleName,
//       lastName,
//       userName,
//       hashedPassword, // Use hashed password
//       isAgreement,
//       1, // user_type is always 1
//       false, // is_online is boolean false
//       0 // is_archive is always 0
//     ];

//     db.query(sql, values, (err, results) => {
//       if (err) {
//         console.error(err);
//         return res.status(500).json({ message: 'Error inserting data into the database.' });
//       }
//       res.status(201).json({ message: 'Account created successfully!', data: results });
//     });
//   });
// });

// // Login route
// app.post('/User_Account', async (req, res) => {
//   const { username, password } = req.body;

//   if (!username || !password) {
//     return res.status(400).json({ message: 'Username and password are required.' });
//   }

//   try {
//     const [user] = await db.query('SELECT * FROM User_Account WHERE username = ?', [username]);
//     if (!user) {
//       return res.status(401).json({ message: 'Invalid username or password.' });
//     }

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return res.status(401).json({ message: 'Invalid username or password.' });
//     }

//     const token = jwt.sign({ id: user.id, username: user.username }, 'your_jwt_secret', { expiresIn: '1h' });

//     res.json({ message: 'Login successful!', token });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server error.' });
//   }
// });
