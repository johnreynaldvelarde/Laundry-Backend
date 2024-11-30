import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config({ path: "./.env" });

let pool;

const getPool = async () => {
  if (!pool) {
    if (process.env.RAILWAY_ENVIRONMENT && process.env.DATABASE_URL) {
      console.log("Connecting to Railway database using DATABASE_URL");
      pool = mysql.createPool(process.env.DATABASE_URL);
    } else {
      console.log(
        "Connecting to local database using individual environment variables"
      );
      pool = mysql.createPool({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
        waitForConnections: true,
        connectionLimit: 100,
        queueLimit: 0,
      });
    }
  }
  return pool;
};

export { getPool };
