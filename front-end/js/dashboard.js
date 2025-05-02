const API_BASE = "http://localhost:8000";
const token = localStorage.getItem("token");

if (!token) {
  window.location.href = "login.html";
}

const taskForm = document.getElementById("task-form");
const taskList = document.getElementById("task-list");

const fetchTasks = async () => {
  try {
    const res = await fetch(`${API_BASE}/tasks`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) throw new Error("Failed to fetch tasks");

    const data = await res.json();
    taskList.innerHTML = "";
    data.forEach(renderTask);
  } catch (err) {
    console.error("Error fetching tasks:", err);
  }
};

const renderTask = (task) => {
  const card = document.createElement("div");
  card.className = "task-card";
  card.innerHTML = `
    <div class="task-info">
      <h4>${task.title}</h4>
      <p>${task.description}</p>
    </div>
    <div class="task-actions">
      <button class="edit-btn">✏️</button>
      <button class="delete-btn">🗑️</button>
    </div>
  `;

  card.querySelector(".edit-btn").onclick = () => editTask(task.id, task.title, task.description);
  card.querySelector(".delete-btn").onclick = () => deleteTask(task.id);

  taskList.appendChild(card);
};

taskForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const title = document.getElementById("title").value.trim();
  const description = document.getElementById("description").value.trim();
  if (!title) return;

  await fetch(`${API_BASE}/tasks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ title, description }),
  });

  taskForm.reset();
  fetchTasks();
});

const deleteTask = async (id) => {
  if (confirm("Are you sure you want to delete this task?")) {
    try {
      const res = await fetch(`${API_BASE}/tasks/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to delete task");

      fetchTasks();
    } catch (err) {
      console.error("Error deleting task:", err);
      alert("There was an issue deleting the task. Please try again.");
    }
  }
};

const editTask = async (id, oldTitle, oldDesc) => {
  const newTitle = prompt("New Title:", oldTitle);
  const newDesc = prompt("New Description:", oldDesc);

  if (newTitle !== null && newDesc !== null) {
    const response = await fetch(`${API_BASE}/tasks/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        title: newTitle,
        description: newDesc,
      }),
    });

    if (response.ok) {
      fetchTasks(); // refresh list
    } else {
      const err = await response.json();
      alert("Failed to edit task: " + err.detail);
    }
  }
};


document.getElementById("logout-btn").addEventListener("click", () => {
  localStorage.removeItem("token");
  window.location.href = "login.html";
});

fetchTasks();
