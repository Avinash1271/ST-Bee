const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();

// Load data from JSON file
let tasks = JSON.parse(fs.readFileSync('data.json'));

// Home page
app.get('/', (req, res) => {
  res.send(`
    <h1>Todo App</h1>
    <ul>
      <li><a href="/addtask">Add Task</a></li>
      <li><a href="/tasks">View Tasks</a></li>
    </ul>
  `);
});

// Add task form
app.get('/addtask', (req, res) => {
  res.send(`
    <h1>Add Task</h1>
    <form action="/addtask" method="POST">
      <label for="title">Title:</label><br>
      <input type="text" id="title" name="title"><br>
      <label for="description">Description:</label><br>
      <textarea id="description" name="description"></textarea><br><br>
      <input type="submit" value="Submit">
    </form> 
  `);
});

// Add task endpoint
app.post('/addtask', bodyParser.urlencoded({ extended: true }), (req, res) => {
  const task = {
    id: tasks.length + 1,
    title: req.body.title,
    description: req.body.description
  };
  tasks.push(task);
  fs.writeFileSync('data.json', JSON.stringify(tasks));
  res.redirect('/tasks');
});

// View tasks page
app.get('/tasks', (req, res) => {
  let taskList = '';
  tasks.forEach(task => {
    taskList += `<li>${task.title}: ${task.description}</li>`;
  });
  res.send(`
    <h1>Tasks</h1>
    <ul>
      ${taskList}
    </ul>
  `);
});

// 404 Page Not Found
app.use((req, res) => {
  res.status(404).send('Page Not Found');
});

const PORT = 4000; // Change the port number to 4000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

