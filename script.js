let tasks = JSON.parse(localStorage.getItem("advancedKanban")) || {
  todo: [],
  doing: [],
  done: []
};

const searchInput = document.getElementById("searchInput");
const themeToggle = document.getElementById("themeToggle");

function saveTasks() {
  localStorage.setItem("advancedKanban", JSON.stringify(tasks));
}

function renderTasks(filter = "") {

  document.querySelectorAll(".task-list").forEach(list => {
    list.innerHTML = "";
  });

  for (let column in tasks) {

    const columnElement =
      document.querySelector(`#${column} .task-list`);

    tasks[column]
      .filter(task =>
        task.title.toLowerCase().includes(filter.toLowerCase())
      )
      .forEach(task => {

        const taskCard = document.createElement("div");

        taskCard.className = "task";
        taskCard.draggable = true;
        taskCard.id = task.id;

        taskCard.addEventListener("dragstart", drag);

        taskCard.innerHTML = `
          <span class="priority ${task.priority}">
            ${task.priority.toUpperCase()}
          </span>

          <h3>${task.title}</h3>

          <p>📅 Due: ${task.dueDate}</p>

          <div class="task-buttons">
            <button class="edit-btn"
                    onclick="editTask('${column}', '${task.id}')">
              Edit
            </button>

            <button class="delete-btn"
                    onclick="deleteTask('${column}', '${task.id}')">
              Delete
            </button>
          </div>
        `;

        columnElement.appendChild(taskCard);
      });
  }

  saveTasks();
}

function addTask(column) {

  const title = prompt("Enter task title");

  if (!title) return;

  const dueDate = prompt("Enter due date");

  const priority = prompt(
    "Priority: high / medium / low"
  ).toLowerCase();

  const newTask = {
    id: Date.now().toString(),
    title,
    dueDate,
    priority
  };

  tasks[column].push(newTask);

  renderTasks();
}

function deleteTask(column, id) {

  tasks[column] =
    tasks[column].filter(task => task.id !== id);

  renderTasks();
}

function editTask(column, id) {

  const task =
    tasks[column].find(task => task.id === id);

  const newTitle =
    prompt("Edit title", task.title);

  if (!newTitle) return;

  task.title = newTitle;

  renderTasks();
}

function allowDrop(event) {
  event.preventDefault();
}

function drag(event) {
  event.dataTransfer.setData("taskId", event.target.id);
}

function drop(event) {

  event.preventDefault();

  const taskId =
    event.dataTransfer.getData("taskId");

  const newColumn =
    event.currentTarget.parentElement.id;

  let movedTask = null;

  for (let column in tasks) {

    const taskIndex =
      tasks[column].findIndex(task => task.id === taskId);

    if (taskIndex > -1) {

      movedTask = tasks[column][taskIndex];

      tasks[column].splice(taskIndex, 1);

      break;
    }
  }

  if (movedTask) {
    tasks[newColumn].push(movedTask);
  }

  renderTasks(searchInput.value);
}

searchInput.addEventListener("input", () => {
  renderTasks(searchInput.value);
});

// Theme Toggle
if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark");
}

themeToggle.addEventListener("click", () => {

  document.body.classList.toggle("dark");

  if (document.body.classList.contains("dark")) {
    localStorage.setItem("theme", "dark");
    themeToggle.innerText = "☀";
  }
  else {
    localStorage.setItem("theme", "light");
    themeToggle.innerText = "🌙";
  }
});

renderTasks();