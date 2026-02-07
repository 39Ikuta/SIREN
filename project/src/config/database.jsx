import mysql from 'mysql2/promise';

// Database configuration
const dbConfig = {
  host: import.meta.env.VITE_DB_HOST || 'localhost',
  user: import.meta.env.VITE_DB_USER || 'your_username',
  password: process.env.VITE_DB_PASSWORD || 'your_password',
  database: process.env.VITE_DB_NAME || 'your_database_name',
  port: Number(process.env.VITE_DB_PORT) || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

// Create a connection pool
const pool = mysql.createPool(dbConfig);

// Test the connection
const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('Database connection successful');
    connection.release();
  } catch (error) {
    console.error('Error connecting to the database:', error);
  }
};

export { pool, testConnection }; 