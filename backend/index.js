const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
// const mysql = require('mysql');
const mysql = require('mysql2');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MySQL Connection

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '12345',
  database: 'toDoList',
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL');
});

// API Routes

// Get all todos
app.get('/todos', (req, res) => {
  connection.query('SELECT * FROM todos', (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(results);
  });
});

// Add a new todo
app.post('/todos', (req, res) => {
  const { text } = req.body;
  const query = 'INSERT INTO todos (text) VALUES (?)';
  connection.query(query, [text], (err, result) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ text });
  });
});

// Update a todo
app.put('/todos/:id', (req, res) => {
  const { id } = req.params;
  const { text } = req.body;
  const query = 'UPDATE todos SET text = ? WHERE id = ?';
  connection.query(query, [text, id], (err) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ message: 'Todo updated successfully!' });
  });
});

// Delete a todo
app.delete('/todos/:id', (req, res) => {
  const { id } = req.params;
  console.log(id);
  const query = 'DELETE FROM todos WHERE id = ?';
  connection.query(query, [id], (err) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ message: 'Todo deleted successfully!' });
  });
});

// Start the server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
