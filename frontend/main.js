// Example: Task Adding Logic
document.addEventListener('DOMContentLoaded', () => {
  const taskForm = document.getElementById('taskForm');
  const taskList = document.getElementById('taskList');

  if (taskForm && taskList) {
    taskForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const taskInput = document.getElementById('taskInput');
      const taskText = taskInput.value.trim();
      if (taskText) {
        const li = document.createElement('li');
        li.textContent = taskText;
        taskList.appendChild(li);
        taskInput.value = '';
      }
    });
  }

  // Add similar logic for login/signup handling if needed
});