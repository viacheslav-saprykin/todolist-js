'use strict'

let currentTodos = [
  { id:1, title: 'HTML', completed: true },
  { id:2, title: 'CSS', completed: true },
  { id:3, title: 'Javascript', completed: false },
];

const root = document.querySelector('.todoapp');
const newTodoField = root.querySelector('.new-todo');
const itemsList = root.querySelector('.todo-list');
const allToggler = root.querySelector('.toggle-all'); 
const clearCompletedButton = root.querySelector('.clear-completed');
const filter = root.querySelector('.filters');

initTodos();

function initTodos() {
  itemsList.innerHTML = `
    ${currentTodos.map(todo => `
      <li
        class="todo-item ${todo.completed ? 'completed' : ''}"
        data-todo-id="${todo.id}"
      >
        <input
          id="todo-${todo.id}"
          class="toggle"
          type="checkbox"
          ${todo.completed ? 'checked' : ''}
        >
        <label for="todo-${todo.id}">${todo.title}</label>
        <button class="destroy"></button>
      </li>
    `).join('')}
  `;

  updateInfo();
}

function updateInfo() {
  const completedTogglers = root.querySelectorAll('.toggle:checked');
  const activeTogglers = root.querySelectorAll('.toggle:not(:checked)');
  const counter = root.querySelector('.todo-count');
  const footer = root.querySelector('.footer');
  const toggleAllContainer = root.querySelector('.toglle-all-container');

  counter.innerHTML = `${activeTogglers.length} items left`;
  allToggler.checked = activeTogglers.length === 0;
  clearCompletedButton.hidden = completedTogglers.length === 0;

  const hasTodos = completedTogglers.length > 0 || activeTogglers.length > 0;
  footer.hidden = !hasTodos;
  toggleAllContainer.hidden = !hasTodos;

  console.log(currentTodos);
}

// Add todo
newTodoField.addEventListener('keydown', (event) => {
  if (event.key !== 'Enter') {
    return;
  }

  if (!newTodoField.value) {
    return;
  }

  const id = +new Date();
  currentTodos.push({
    id: id,
    title: newTodoField.value,
    completed: false,
  });

  initTodos()

  newTodoField.value = '';
  updateInfo();
});

// Remove todo
itemsList.addEventListener('click', (event) => {
  if (!event.target.matches('.destroy')) {
    return;
  }

  const item = event.target.closest('.todo-item');
  currentTodos = currentTodos.filter(todo => todo.id !== +item.dataset.todoId)

  initTodos();
  updateInfo();
});

// Toggle todo status 
itemsList.addEventListener('change', (event) => {
  if (!event.target.matches('.toggle')) {
    return;
  }

  const item = event.target.closest('.todo-item');
  const selectedTodo = currentTodos.find(todo => todo.id === +item.dataset.todoId)
  selectedTodo.completed = event.target.checked;

  initTodos();
  updateInfo();
});

// Clear completed
clearCompletedButton.addEventListener('click', () => {
  currentTodos = currentTodos.filter(todo => !todo.completed);
  initTodos();
  updateInfo();
});

// Toggle all
allToggler.addEventListener('change', () => {
  currentTodos.forEach(todo => {
    todo.completed = allToggler.checked;
  });

  initTodos();
  updateInfo();
});

// Filter todos
filter.addEventListener('click', (event) => {
  if (!event.target.dataset.filter) {
    return;
  }

  const filterButtons = root.querySelectorAll('[data-filter]');

  for (const button of filterButtons) {
   button.classList.toggle('selected', event.target === button);
  }

  const togglers = root.querySelectorAll('.toggle');

  for (const toggler of togglers) {
    const item = toggler.closest('.todo-item');

    switch (event.target.dataset.filter) {
      case 'all':
          item.hidden = false;
          break;

      case 'active': 
        item.hidden = toggler.checked;
        break;
      
      case 'completed':
        item.hidden = !toggler.checked;
        break;
    }
  }
});
