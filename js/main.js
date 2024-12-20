const form = document.querySelector('#form');
const taskInput = document.querySelector('#taskInput');
const taskList = document.querySelector('#tasksList');
const emtyList = document.querySelector('#emptyList');

let tasks = [];

if (localStorage.getItem('tasks')) {
tasks = JSON.parse(localStorage.getItem('tasks'));
tasks.forEach((task) => renderTask(task));
}

checkEmptyList();

form.addEventListener('submit', addTask);
taskList.addEventListener('click', deleteTask);
taskList.addEventListener('click', doneTask)



function addTask(event) {
    // Отменяем перезагрузку страницы при отправке формы
    event.preventDefault();
    // Достаем текст задачи из поля ввода
    const taskText = taskInput.value;

    // Описываем задачу в виде обьекта
    const newTask = {
        id: Date.now(),
        text: taskText,
        done: false,
    };

    // Добавляем задачу в массив с задачами
    tasks.push(newTask);
    // Сохраняем список задач в хранилище браузера LocalStorage
    saveLocalStorage();

   renderTask(newTask);

    // Очищаем поле ввода и перемешаем на него фокус
    taskInput.value = "";
    taskInput.focus();
    checkEmptyList();

}

function deleteTask(event) {
    // Проверяем если клик был не по кнопке удалить задачу
    if (event.target.dataset.action !== 'delete') return;

    //  event.target находим элемент по которому был клик
    const parendNode = event.target.closest('.list-group-item');

    // Определяем ID задачи
    const id = +parendNode.id;

    // // Находим индекс задачи в массиве
    const index = tasks.findIndex((task) => task.id === id);

    // //Удаляем задачу из массива с задачами
    tasks.splice(index, 1);
    saveLocalStorage();

    // Еще вариант
    // tasks = tasks.filter( (task) => task.id !== id)

    parendNode.remove();
    checkEmptyList()
}

function doneTask(event) {
    if (event.target.dataset.action !== 'done') return;

    const parendNode = event.target.closest('.list-group-item');
    const id = Number(parendNode.id);

    const task = tasks.find(function (task) {
        if (task.id === id) {
            return true
        }
    })

    task.done = !task.done

    saveLocalStorage();

    const taskTitle = parendNode.querySelector('.task-title');
    taskTitle.classList.add('task-title--done');
}

function checkEmptyList() {
    if (tasks.length === 0) {
        const emptyListElement = `
                <li id="emptyList" class="list-group-item empty-list">
					<img src="./img/leaf.svg" alt="Empty" width="48" class="mt-3">
					<div class="empty-list__title">Список дел пуст</div>
				</li> `

        taskList.insertAdjacentHTML('afterbegin', emptyListElement);
    }

    if (tasks.length > 0) {
        const emptyListEl = document.querySelector("#emptyList");
        emptyListEl ? emptyListEl.remove() : null;
    }
}

function saveLocalStorage() {
    localStorage.setItem('tasks', JSON.stringify(tasks))
}

function renderTask(task) {
     // Формируем CSS класс
     const cssClass = task.done ? "task-title task-title--done" : "task-title";

     // Формируем разметку для новой задачи
     const taskHTML = `	<li id="${task.id}" class="list-group-item d-flex justify-content-between task-item">
                     <span class="${cssClass}">${task.text}</span>
                     <div class="task-item__buttons">
                         <button type="button" data-action="done" class="btn-action">
                             <img src="./img/tick.svg" alt="Done" width="18" height="18">
                         </button>
                         <button type="button" data-action="delete" class="btn-action">
                             <img src="./img/cross.svg" alt="Done" width="18" height="18">
                         </button>
                     </div>
                 </li>`;
 
     taskList.insertAdjacentHTML('beforeend', taskHTML);
}


