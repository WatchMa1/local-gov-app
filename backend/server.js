const express = require('express');
const cors = require('cors');
const db = require('./db'); 
const app = express();

app.use(cors());
app.use(express.json());

// Example route to test database connection
app.get('/test-db', (req, res) => {
    db.query('SELECT 1 + 1 AS solution', (err, results) => {
        if (err) {
            console.error('Error executing query:', err.message);
            return res.status(500).send('Database query error');
        }
        res.send(`Database test successful: ${results[0].solution}`);
    });
});

// Create a new outcome
app.post('/outcomes', (req, res) => {
    const { name } = req.body;

    if (!name) {
        return res.status(400).json({ error: 'Name is required' });
    }

    const sql = 'INSERT INTO outcomes (name) VALUES (?)';
    db.query(sql, [name], (err, result) => {
        if (err) {
            console.error('Error inserting outcome:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        res.status(201).json({ id: result.insertId, name });
    });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
