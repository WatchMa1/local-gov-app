const express = require('express');
const cors = require('cors');
const db = require('./db'); 
const app = express();
const corsOptions = {
    origin: '*', 
    methods: 'GET,POST,PUT,DELETE',
    allowedHeaders: 'Content-Type,Authorization',
  };

app.use(cors(corsOptions));
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


// --- CRUD Endpoints for `outcomes` ---
app.get('/outcomes', (req, res) => {
    db.query('SELECT * FROM outcomes', (err, results) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        res.json(results);
    });
});

app.get('/outcomes/:id', (req, res) => {
    const { id } = req.params;
    db.query('SELECT * FROM outcomes WHERE id = ?', [id], (err, results) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        res.json(results[0] || {});
    });
});

app.post('/outcomes', (req, res) => {
    const { name } = req.body;
    const sql = 'INSERT INTO outcomes (name, created_by, status) VALUES (?, ?, ?)';
    db.query(sql, [name, 'admin', 1], (err, result) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        res.status(201).json({ id: result.insertId, name });
    });
});

app.put('/outcomes/:id', (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    const sql = 'UPDATE outcomes SET name = ?, date_modified = NOW(), modified_by = ? WHERE id = ?';
    db.query(sql, [name, 'admin', id], (err, result) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        res.json({ message: 'Outcome updated successfully' });
    });
});

app.delete('/outcomes/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM outcomes WHERE id = ?';
    db.query(sql, [id], (err, result) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        res.json({ message: 'Outcome deleted successfully' });
    });
});


// CRUD for `indicators`
app.get('/indicators', (req, res) => {
    db.query('SELECT * FROM indicators', (err, results) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        res.json(results);
    });
});

app.get('/indicators/:id', (req, res) => {
    const { id } = req.params;
    db.query('SELECT * FROM indicators WHERE id = ?', [id], (err, results) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        res.json(results[0] || {});
    });
});

app.post('/indicators', (req, res) => {
    const { name, outcome_id } = req.body;
    const sql = 'INSERT INTO indicators (name, outcome_id, created_by, status) VALUES (?, ?, ?, ?)';
    db.query(sql, [name, outcome_id, 'admin', 1], (err, result) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        res.status(201).json({ id: result.insertId, name });
    });
});

app.put('/indicators/:id', (req, res) => {
    const { id } = req.params;
    const { name, outcome_id } = req.body;
    const sql = 'UPDATE indicators SET name = ?, outcome_id = ?, date_modified = NOW(), modified_by = ? WHERE id = ?';
    db.query(sql, [name, outcome_id, 'admin', id], (err, result) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        res.json({ message: 'Indicator updated successfully' });
    });
});

app.delete('/indicators/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM indicators WHERE id = ?';
    db.query(sql, [id], (err, result) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        res.json({ message: 'Indicator deleted successfully' });
    });
});


// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
