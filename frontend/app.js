const API_BASE = "http://localhost:3000"; // change if needed
const taskForm = document.getElementById("task-form");
const taskList = document.getElementById("task-list");

// Fetch tasks and render them

const fetchTasks = async () => {
  const res = await fetch(`${API_BASE}/tasks`);
  const data = await res.json();
  taskList.innerHTML = "";
  data.forEach(task => renderTask(task));
};

// Render a single task item
const renderTask = (task) => {
  const li = document.createElement("li");
  li.className = "task-item";
  li.innerHTML = `
    <span>${task.title}</span>: ${task.description}
    <div class="actions">
      <button onclick="editTask('${task.id}', '${task.title.replace(/'/g, "\\'")}', '${task.description.replace(/'/g, "\\'")}')">✏️</button>
      <button onclick="deleteTask('${task.id}')">🗑️</button>
    </div>
  `;
  taskList.appendChild(li);
};

// Delete a task

const deleteTask = async (id) => {
  await fetch(`${API_BASE}/tasks/${id}`, {
    method: "DELETE"
  });
  fetchTasks();
};

// Edit a task

const editTask = async (id, oldTitle, oldDesc) => {
  const newTitle = prompt("Edit Title:", oldTitle);
  const newDesc = prompt("Edit Description:", oldDesc);
  if (newTitle !== null && newDesc !== null) {
    await fetch(`${API_BASE}/tasks/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: newTitle, description: newDesc })
    });
    fetchTasks();
  }
};


// Handle form submit

taskForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const title = document.getElementById("title").value.trim();
  const description = document.getElementById("description").value.trim();

  if (title && description) {
    await fetch(`${API_BASE}/tasks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, description })
    });
    taskForm.reset();
    fetchTasks();
  }
});

// Initial fetch
fetchTasks();
const cors = require('cors');
app.use(cors());
