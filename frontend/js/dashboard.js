const API_BASE = "http://localhost:8000";
const token = localStorage.getItem("token");

if (!token) {
    window.location.href = "login.html";
}

// === Global Modal Functions ===
function openForm() {
    document.getElementById("taskModal").style.display = "block";
}

function closeForm() {
    document.getElementById("taskModal").style.display = "none";
}

function addTask() {
    const title = document.getElementById("taskInput").value.trim();
    const description = document.getElementById("taskdescriptionInput").value.trim();
    const due_date = document.getElementById("task_due_date").value.trim();
    const priority = document.getElementById("priority").value;

    if (!title) {
        alert("Task title is required.");
        return;
    }

    if (!priority) {
        alert("Please select a priority.");
        return;
    }

    const taskData = {
        title,
        description,
        due_date,
        priority,
    };

    fetch(`${API_BASE}/tasks/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(taskData),
    })
        .then((res) => {
            if (res.ok) {
                // Clear form and close modal
                document.getElementById("taskInput").value = "";
                document.getElementById("taskdescriptionInput").value = "";
                document.getElementById("task_due_date").value = "";
                document.getElementById("priority").value = "";
                closeForm();
                location.reload();
            } else {
                alert("Failed to add task");
            }
        });
}

// === Render Task UI ===
function renderTask(task) {
    const taskItem = document.createElement("div");
    taskItem.classList.add("task-item");

    const left = document.createElement("div");
    const T = document.createElement("div");
    T.className = "titleoftask";
    T.innerText = task.title;

    const D = document.createElement("div");
    D.className = "descriptionoftask";
    D.innerText = task.description;

    left.appendChild(T);
    left.appendChild(D);

    const right = document.createElement("div");
    right.classList.add("task-meta");

    if (task.priority) {
        const priority = document.createElement("span");
        priority.innerText = task.priority;
        priority.classList.add(`priority-${task.priority}`);
        right.appendChild(priority);
    }

    if (task.due_date) {
        const dueDate = document.createElement("span");
        dueDate.innerText = new Date(task.due_date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
        });
        right.appendChild(dueDate);
    }

    taskItem.appendChild(left);
    taskItem.appendChild(right);
    return taskItem;
}

// === Main Event Bindings ===
document.addEventListener("DOMContentLoaded", () => {
    const taskList = document.getElementById("task-list");

    // Load existing tasks
    fetch(`${API_BASE}/tasks/`, {
        headers: { Authorization: `Bearer ${token}` },
    })
        .then((res) => res.json())
        .then((tasks) => {
            taskList.innerHTML = "";
            tasks.forEach((task) => taskList.appendChild(renderTask(task)));
        })
        .catch((err) => {
            console.error("Failed to fetch tasks:", err);
        });

    // Bind Logout button
    document.getElementById("Logout").addEventListener("click", () => {
        localStorage.removeItem("token");
        window.location.href = "index.html";
    });

    // Bind Add Task button (form open)
    document.getElementById("add-task-btn").addEventListener("click", openForm);

    // Optional: bind modal Submit button via JS (if not using inline `onclick`)
    document.getElementById("submitTaskButton").addEventListener("click", addTask);
});

document.addEventListener("DOMContentLoaded", fetchUsername);

async function fetchUsername() {
    const token = localStorage.getItem("token"); // ✅ Corrected key
    if (!token) {
        console.warn("No token found.");
        return;
    }

    try {
        const response = await fetch(`${API_BASE}/auth/me`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        if (!response.ok) {
            console.error("Failed:", response.status);
            return;
        }

        const data = await response.json();
        document.getElementById("username").textContent = `${data.username}`;
    } catch (error) {
        console.error("Error:", error);
    }
}
