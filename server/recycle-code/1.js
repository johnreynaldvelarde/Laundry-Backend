// This is dependecies
const express = require('express');
const mysql = require('mysql');
const cors = require('cors');

const app = express()
app.use(cors())

// This database config
const db = mysql/mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'lizaso_db'
})

// Connect to the database
db.connect((err) => {
    if (err) {
      console.error('Error connecting to the database:', err);
      process.exit(1); // Exit the process if connection fails
    }
    console.log('Connected to the database.');
  })

app.get('/', (re, res) =>{
    return res.json("From backend side")
})

app.get('/User_Account', (req, res) => {
    const sql = "SELECT * FROM User_Account"
    db.query(sql, (err, data) =>{
        if(err) return res.json(err);
        return res.json(data);
    })
})


// Run the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
})

// Route to handle POST request
app.post('/User_Account', (req, res) => {
    const { firstName, middleName, lastName, userName, password, isAgreement } = req.body;
  
    if (!firstName || !lastName || !userName || !password || typeof isAgreement !== 'boolean') {
      return res.status(400).json({ message: 'Please provide all required fields.' });
    }
  
    // Insert the data into the database
    const sql = `
      INSERT INTO User_Account (first_name, middle_name, last_name, username, password, isAgreement, user_type, isOnline, isArchive, date_created)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
    `;
  
    const values = [
      firstName,
      middleName,
      lastName,
      userName,
      password,
      isAgreement,
      1, // user_type is always 1
      false, // is_online is boolean false
      0 // is_archive is always 0
    ];
  
    db.query(sql, values, (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: 'Error inserting data into the database.' });
      }
      res.status(201).json({ message: 'Account created successfully!', data: results });
    });
  });



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