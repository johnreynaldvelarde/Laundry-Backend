// const ensureMainStoreExists = (db) => {
//     const query = 'SELECT COUNT(*) AS count FROM Stores WHERE is_main_store = TRUE';
//     db.query(query, (err, results) => {
//       if (err) throw err;
  
//       const storeCount = results[0].count;
//       if (storeCount === 0) {
//         const storeId = 'LIZASO-' + new Date().getTime(); // Unique store ID starting with LIZASO
  
//         const insertStoreQuery = `INSERT INTO Stores 
//           (store_id, store_name, store_address, store_contact, is_main_store, date_created) 
//           VALUES (?, 'Main Store', 'Main Address', 'Main Contact', TRUE, NOW())`;
  
//         db.query(insertStoreQuery, [storeId], (err) => {
//           if (err) throw err;
//           console.log('Main store created.');
//         });
//       }
//     });
//   };
  
//   module.exports = { ensureMainStoreExists };

// export const getMainStoreId = (db, callback) => {
//   const query = 'SELECT id FROM Stores WHERE is_main_store = TRUE';
//   db.query(query, (err, results) => {
//     if (err) throw err;
//     if (results.length > 0) {
//       callback(results[0].id);
//     } else {
//       callback(null); // No main store found
//     }
//   });
// };

// export const ensureMainStoreExists = (db) => {
//   const query = 'SELECT COUNT(*) AS count FROM Stores WHERE is_main_store = TRUE';
//   db.query(query, (err, results) => {
//     if (err) throw err;

//     const storeCount = results[0].count;
//     if (storeCount === 0) {
//       const storeId = 'LIZASO-' + new Date().getTime(); // Unique store ID starting with LIZASO

//       const insertStoreQuery = `INSERT INTO Stores 
//         (store_id, store_name, store_address, store_contact, is_main_store, date_created) 
//         VALUES (?, 'Main Store', 'Main Address', 'Main Contact', TRUE, NOW())`;

//       db.query(insertStoreQuery, [storeId], (err) => {
//         if (err) throw err;
//         console.log('Main store created.');
//       });
//     }
//   });
// };

// Ensure to use async functions with promise-based queries
export const getMainStoreId = async (db) => {
  try {
    const [results] = await db.query('SELECT id FROM Stores WHERE is_main_store = TRUE');
    if (results.length > 0) {
      return results[0].id;
    } else {
      return null; // No main store found
    }
  } catch (err) {
    throw new Error(`Error fetching main store ID: ${err.message}`);
  }
};

export const ensureMainStoreExists = async (db) => {
  try {
    // Check if a main store already exists
    const [[{ count }]] = await db.query('SELECT COUNT(*) AS count FROM Stores WHERE is_main_store = TRUE');
    if (count === 0) {
      const storeId = 'LIZASO-' + new Date().getTime(); // Unique store ID starting with LIZASO

      // Insert a new main store
      const insertStoreQuery = `INSERT INTO Stores 
        (store_id, store_name, store_address, store_contact, is_main_store, date_created) 
        VALUES (?, 'Main Store', 'Main Address', 'Main Contact', TRUE, NOW())`;

      await db.query(insertStoreQuery, [storeId]);
      console.log('Main store created.');
    }
  } catch (err) {
    throw new Error(`Error ensuring main store exists: ${err.message}`);
  }
};

  