const API_BASE = "http://localhost:5500"; // Change if needed

const taskForm = document.getElementById("task-form");
const taskList = document.getElementById("task-list");

const fetchTasks = async () => {
  const res = await fetch(${API_BASE}/tasks);
  const data = await res.json();
  taskList.innerHTML = "";
  data.forEach(task => renderTask(task));
};

const renderTask = (task) => {
  const li = document.createElement("li");
  li.className = "task-item";
  li.innerHTML = `
    <span><strong>${task.title}</strong>: ${task.description}</span>
    <div class="actions">
      <button class="edit-btn">✏️</button>
      <button class="delete-btn">🗑️</button>
    </div>
  `;

  // Add event listeners
  li.querySelector(".edit-btn").addEventListener("click", () => {
    editTask(task.id, task.title, task.description);
  });

  li.querySelector(".delete-btn").addEventListener("click", () => {
    deleteTask(task.id);
  });

  taskList.appendChild(li);
};

taskForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const title = document.getElementById("title").value.trim();
  const description = document.getElementById("description").value.trim();
  if (!title) return;

  await fetch(${API_BASE}/tasks, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, description }),
  });

  taskForm.reset();
  fetchTasks();
});

const deleteTask = async (id) => {
  await fetch(${API_BASE}/tasks/${id}, { method: "DELETE" });
  fetchTasks();
};

const editTask = async (id, oldTitle, oldDesc) => {
  const newTitle = prompt("Edit Title:", oldTitle);
  const newDesc = prompt("Edit Description:", oldDesc);

  if (newTitle !== null) {
    await fetch(${API_BASE}/tasks/${id}, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: newTitle, description: newDesc }),
    });
    fetchTasks();
  }
};

fetchTasks();