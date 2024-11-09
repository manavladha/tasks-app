const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// In-memory task storage (for demonstration purposes)
let tasks = [];

// Routes
app.post('/tasks', (req, res) => {
    const { title, date } = req.body;
    const newTask = { id: tasks.length + 1, title, date, completed: false };
    tasks.push(newTask);
    res.status(201).json(newTask);
});

app.get('/tasks/:date', (req, res) => {
    const date = req.params.date;
    const tasksForDate = tasks.filter(task => new Date(task.date).toDateString() === new Date(date).toDateString());
    res.json(tasksForDate);
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
