// // Dependencies
// const express = require('express');
// const cors = require('cors');
// const bodyParser = require('body-parser');
// const bcrypt = require('bcrypt'); // For hashing passwords
// const { createDefaultAdmin, handleLogin } = require('../services/authService');
// const { ensureMainStoreExists } = require('../services/storeService');

// const app = express();
// const port = process.env.PORT || 3002;

// // Middleware
// app.use(cors()); // Enable CORS
// app.use(bodyParser.json()); // Parse JSON request bodies

// // Initialize Database Connection
// const { connectToDatabase } = require('./db/dbConfig');
// const db = connectToDatabase();

// // Ensure the main store exists and create default admin if necessary
// ensureMainStoreExists(db);
// createDefaultAdmin(db);

// // Routes
// app.post('/login', (req, res) => handleLogin(req, res, db));

// // Start Server
// app.listen(port, () => {
//   console.log(`Server is running on port ${port}`);
// });
// Dependencies
const express = require('express');
const cors = require('cors');
const dotnev = require('dotenv');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt'); // For hashing passwords
const { createDefaultAdmin, handleLogin } = require('../src/services/authService');
const { ensureMainStoreExists } = require('./services/storeService');
const authenticateToken = require('../src/middleware/authMiddleware'); 


dotnev.config({path: './.env'})
const app = express();
const port = process.env.PORT;

// Middleware
app.use(cors()); // Enable CORS
app.use(bodyParser.json()); // Parse JSON request bodies

// Initialize Database Connection
const { connectToDatabase } = require('../src/db/dbConfig');
const db = connectToDatabase();

// Ensure the main store exists and create default admin if necessary
ensureMainStoreExists(db);
createDefaultAdmin(db);

// Public Routes
app.post('/login', (req, res) => handleLogin(req, res, db));

// Protected Routes (Example)
app.get('/protected-route', authenticateToken, (req, res) => {
  res.json({ message: 'This is a protected route.', user: req.user });
});

// Start Server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
