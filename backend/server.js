const express = require('express');
const cors = require('cors');
const db = require('./db');
const app = express();
const corsOptions = {
    origin: 'exp://10.10.30.188:8081',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
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
    console.log('Request body:', req.body); // Add this to debug
    const { name } = req.body;
    if (!name) {
        return res.status(400).json({ error: 'Name is required' });
    }
    const sql = 'INSERT INTO outcomes (name, created_by, status) VALUES (?, ?, ?)';
    db.query(sql, [name, 1, 1], (err, result) => {
        if (err) {
            console.error('Database error:', err); // Log detailed error info
            return res.status(500).json({ error: 'Database error' });
        }
        console.log('Insert result:', result); // Log the result of the query
        res.status(201).json({ id: result.insertId, name });
    });
});


app.put('/outcomes/:id', (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    const sql = 'UPDATE outcomes SET name = ?, date_modified = NOW(), modified_by = ? WHERE id = ?';
    db.query(sql, [name, 1, id], (err, result) => {
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
    db.query(sql, [name, outcome_id, 1, 1], (err, result) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        res.status(201).json({ id: result.insertId, name });
    });
});

app.put('/indicators/:id', (req, res) => {
    const { id } = req.params;
    const { name, outcome_id } = req.body;
    const sql = 'UPDATE indicators SET name = ?, outcome_id = ?, date_modified = NOW(), modified_by = ? WHERE id = ?';
    db.query(sql, [name, outcome_id, 1, id], (err, result) => {
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

// CRUD for `wards`
app.get('/wards', (req, res) => {
    db.query('SELECT * FROM wards', (err, results) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        res.json(results);
    });
});

app.get('/wards/:id', (req, res) => {
    const { id } = req.params;
    db.query('SELECT * FROM wards WHERE id = ?', [id], (err, results) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        res.json(results[0] || {});
    });
});

app.post('/wards', (req, res) => {
    console.log('Request body:', req.body);
    const { name, indicator_id } = req.body;
    const sql = 'INSERT INTO wards (ward_name , indicator_id, created_by, status) VALUES (?, ?, ?, ?)';
    db.query(sql, [name, indicator_id, 1, 1], (err, result) => {
        if (err) {
            console.error('Database error:', err); // Log detailed error info
            return res.status(500).json({ error: 'Database error' });
        }
        console.log('Insert result:', result);
        res.status(201).json({ id: result.insertId, name });
    });
});

app.put('/wards/:id', (req, res) => {
    const { id } = req.params;
    const { name, district_id } = req.body;
    const sql = 'UPDATE wards SET name = ?, district_id = ?, date_modified = NOW(), modified_by = ? WHERE id = ?';
    db.query(sql, [name, district_id, 1, id], (err, result) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        res.json({ message: 'Ward updated successfully' });
    });
});

app.delete('/wards/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM wards WHERE id = ?';
    db.query(sql, [id], (err, result) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        res.json({ message: 'Ward deleted successfully' });
    });
});

// CRUD for `tablestatistics`
app.get('/tablestatistics', (req, res) => {
    db.query('SELECT * FROM tablestatistics', (err, results) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        res.json(results);
    });
});

app.get('/tablestatistics/:id', (req, res) => {
    const { id } = req.params;
    db.query('SELECT * FROM tablestatistics WHERE id = ?', [id], (err, results) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        res.json(results[0] || {});
    });
});

app.post('/tablestatistics', (req, res) => {
    const { table_name, record_count } = req.body;
    const sql = 'INSERT INTO tablestatistics (table_name, record_count, created_by, status) VALUES (?, ?, ?, ?)';
    db.query(sql, [table_name, record_count, 1, 1], (err, result) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        res.status(201).json({ id: result.insertId, table_name });
    });
});

app.put('/tablestatistics/:id', (req, res) => {
    const { id } = req.params;
    const { table_name, record_count } = req.body;
    const sql = 'UPDATE tablestatistics SET table_name = ?, record_count = ?, date_modified = NOW(), modified_by = ? WHERE id = ?';
    db.query(sql, [table_name, record_count, 1, id], (err, result) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        res.json({ message: 'Table statistic updated successfully' });
    });
});

app.delete('/tablestatistics/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM tablestatistics WHERE id = ?';
    db.query(sql, [id], (err, result) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        res.json({ message: 'Table statistic deleted successfully' });
    });
});


// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
