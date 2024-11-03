// Import the mysql module
const mysql = require('mysql');

// Create a connection to the database
const db = mysql.createConnection({
    host: 'localhost',       
    user: 'root',   
    password: 'kapz.kapz123', 
    database: 'molg_db' 
});

// Connect to the database
db.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err.message);
        return;
    }
    console.log('Connected to the MySQL database.');
});

module.exports = db;
