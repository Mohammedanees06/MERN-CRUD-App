const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',  // Use your MySQL username
    password: 'anees',  // Use your MySQL password
    database: 'mern_crud'
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err.message);  // more graceful error handling
        return;
    }
    console.log('Connected to MySQL');
});

// Get all users
app.get('/api/users', (req, res) => {
    db.query('SELECT * FROM users', (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

// Create a user
app.post('/api/users', (req, res) => {
    const { name, email } = req.body;
    db.query('INSERT INTO users (name, email) VALUES (?, ?)', [name, email], (err, result) => {
        if (err) throw err;
        res.json({ id: result.insertId, name, email });
    });
});
// Update a user
// Update a user
// Update a user route (backend)
app.put('/api/users/:id', (req, res) => {
    const { name, email } = req.body;
    const { id } = req.params;
    
    console.log('Updating user:', { id, name, email });  // Log the incoming request
    
    const query = 'UPDATE users SET name = ?, email = ? WHERE id = ?';
    
    db.query(query, [name, email, id], (err, result) => {
        if (err) {
            console.error('Error updating user:', err);
            return res.status(500).send('Internal Server Error');
        }
        if (result.affectedRows === 0) {
            return res.status(404).send('User not found');
        }
        res.json({ id, name, email });
    });
});

// Delete a user
app.delete('/api/users/:id', (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM users WHERE id = ?', [id], (err, result) => {
        if (err) throw err;
        res.json({ message: 'User deleted' });
    });
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);  // fixed template literal syntax
});
