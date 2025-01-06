const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/todolist', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));


// Define ToDo Schema
const todoSchema = new mongoose.Schema({
    text: { type: String, required: true },
});

const Todo = mongoose.model('Todo', todoSchema);

// API Routes
app.get('/todos', async (req, res) => {
    const todos = await Todo.find();
    res.json(todos);
});

app.post('/todos', async (req, res) => {
    const newTodo = new Todo({
        text: req.body.text,
    });
    await newTodo.save();
    res.json(newTodo);
});

app.delete('/todos/:id', async (req, res) => {
    const { id } = req.params;
    await Todo.findByIdAndDelete(id);
    res.json({ message: 'Todo deleted successfully!' });
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
