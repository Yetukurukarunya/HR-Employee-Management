const mysql = require('mysql2');
const dotenv = require('dotenv');

dotenv.config();

const connection = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'karunya599@',
  database: process.env.DB_NAME || 'hr_management',
  charset: 'utf8mb4'
});

connection.isConnected = false;

connection.connect((err) => {
  if (err) {
    console.error('❌ Error connecting to database:', err.message);
    console.error('\n⚠️  Please check:');
    console.error('   1. MySQL is running');
    console.error('   2. Database credentials in .env file');
    console.error('   3. Database "hr_management" exists');
    console.error('\n💡 Run "node verify-database.js" to verify setup\n');
    connection.isConnected = false;
  } else {
    connection.isConnected = true;
    console.log('✅ Connected to MySQL database: ' + (process.env.DB_NAME || 'hr_management'));
  }
});

// Handle connection errors
connection.on('error', (err) => {
  console.error('❌ Database connection error:', err.message);
  if (err.code === 'PROTOCOL_CONNECTION_LOST') {
    console.error('⚠️  Database connection lost. Please restart the server.');
  }
});

module.exports = connection;