import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

let pool;

const getHostPool = async () => {
  if (!pool) {
    pool = mysql.createPool(process.env.DATABASE_URL);
  }
  return pool;
};

export { getHostPool };

// import mysql from "mysql2/promise";
// import dotenv from "dotenv";

// dotenv.config({ path: "./.env" });

// let pool;

// // Construct the database URL from environment variables
// const urlDB = `mysql://${process.env.MYSQLUSER}:${process.env.MYSQLPASSWORD}@${process.env.MYSQLHOST}:${process.env.MYSQLPORT}/${process.env.MYSQL_DATABASE}`;

// const getPool = async () => {
//   if (!pool) {
//     pool = mysql.createPool(urlDB);
//   }
//   return pool;
// };

// export { getPool };
