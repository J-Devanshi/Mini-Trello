let currentColumn = '';
let tasks = { todo: [], inProgress: [], completed: [] };

function openModal(columnId) {
  currentColumn = columnId;
  document.getElementById("modal").style.display = "flex";
}

function closeModal() {
  document.getElementById("modal").style.display = "none";
  document.getElementById("taskInput").value = '';
  document.getElementById("dueDateInput").value = '';
  document.getElementById("priorityInput").value = 'low';  // Reset to low by default
}

function addTask() {
  const taskInput = document.getElementById("taskInput").value;
  const dueDateInput = document.getElementById("dueDateInput").value;
  const priorityInput = document.getElementById("priorityInput").value; // Get priority from select

  if (taskInput === '') {
    alert('Please enter a task.');
    return;
  }

  const task = {
    text: taskInput,
    dueDate: dueDateInput,
    priority: priorityInput,
  };

  tasks[currentColumn].push(task);
  renderTasks(currentColumn);
  closeModal();
}

function renderTasks(columnId) {
  const columnTasks = tasks[columnId];
  const taskContainer = document.getElementById(`${columnId}Tasks`);
  taskContainer.innerHTML = '';

  columnTasks.forEach((task, index) => {
    const taskCard = document.createElement('div');
    taskCard.classList.add('task-card', task.priority);
    taskCard.draggable = true;
    taskCard.dataset.index = index;
    taskCard.innerHTML = `
      <h4>${task.text}</h4>
      <p>Due: ${task.dueDate}</p>
    `;
    taskCard.addEventListener('dragstart', (e) => {
      e.dataTransfer.setData('task', JSON.stringify(task));
      e.dataTransfer.setData('column', columnId);
    });
    taskContainer.appendChild(taskCard);
  });
}

function allowDrop(e, columnId) {
  e.preventDefault();
}

function dropTask(e, columnId) {
  e.preventDefault();
  const taskData = JSON.parse(e.dataTransfer.getData('task'));
  const taskColumn = e.dataTransfer.getData('column');

  if (taskColumn !== columnId) {
    tasks[taskColumn] = tasks[taskColumn].filter((task) => task.text !== taskData.text);
    tasks[columnId].push(taskData);
    renderTasks(taskColumn);
    renderTasks(columnId);
  }
}

document.querySelectorAll('.column').forEach((column) => {
  column.addEventListener('dragover', (e) => allowDrop(e, column.id));
  column.addEventListener('drop', (e) => dropTask(e, column.id));
});

renderTasks('todo');
renderTasks('inProgress');
renderTasks('completed');
