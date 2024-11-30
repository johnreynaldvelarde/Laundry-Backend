import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

// Import routes
import authRoutes from '../src/routes/authRoutes.js';

// Import File Function 
import {} from '../src/services/default.js'
import { createDefaultAdmin, handleLogin, handleRegister } from '../src/services/authService.js';
import { ensureMainStoreExists } from './services/storeService.js';

// Database Connection
import { getPool } from '../src/db/dbConfig.js';

const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use(cors());
app.use(cookieParser());



// Use routes
app.use('/api', authRoutes);



// Ensure main store exists and start the server
const initServer = async () => {
    try {
      const pool = await getPool();
      const connection = await pool.getConnection();
      try {
        await ensureMainStoreExists(connection);
        await createDefaultAdmin(connection);
        app.listen(port, () => {
          console.log(`Server is running on port ${port}`);
        });
      } finally {
        connection.release();
      }
    } catch (err) {
      console.error('Failed to initialize server:', err);
      process.exit(1);
    }
  };
  
initServer();









// Route to handle registration
// app.post('/register', async (req, res) => {
//     const pool = await getPool();
//     const connection = await pool.getConnection();
//     try {
//       await handleRegister(req, res, connection);
//     } catch (error) {
//       console.error('Error handling register:', error);
//       res.status(500).send('Internal Server Error');
//     } finally {
//       connection.release();
//     }
//   })


// Ensure main store exists on server start
// const initServer = async () => {
//     try {
//       await ensureMainStoreExists(db);
//       app.listen(port, () => {
//         console.log(`Server is running on port ${port}`);
//       });
//     } catch (err) {
//       console.error('Failed to initialize server:', err);
//       process.exit(1);
//     }
// };

// initServer();


// Start the server after the database connection is successful
// app.listen(port, () => {
//     console.log(`Server is running on port ${port}`);
// });





// app.post('/register', (req, res) => handleRegister(req, res, db));

// Ensure the main store exists and create default admin if necessary
// await createDefaultAdmin(db);
// ensureMainStoreExists(db);


// app.post('/register', async (req, res) => {
//     await handleRegister(req, res, db);
// });