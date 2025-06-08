import mysql from "mysql2/promise";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASS,
  database: process.env.DB_DATABASE,
  port: process.env.DB_PORT, // Si es necesario, aunque por defecto es 3306
  ssl: {
    ca: fs.readFileSync(process.env.DB_SSL_CA_PATH),  // Ruta al certificado .pem
    rejectUnauthorized: false,  // Permite certificados autofirmados
  },
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export default pool;
