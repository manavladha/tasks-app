document.getElementById('open-modal-button').addEventListener('click', () => {
    document.getElementById('addTaskModal').classList.remove('hidden');
});

document.getElementById('close-modal-button').addEventListener('click', () => {
    document.getElementById('addTaskModal').classList.add('hidden');
});

document.getElementById('add-task-button').addEventListener('click', addTask);
document.getElementById('voice-button').addEventListener('click', addTaskByVoice);
document.getElementById('prev-date-button').addEventListener('click', () => changeDate(-1));
document.getElementById('next-date-button').addEventListener('click', () => changeDate(1));

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let currentDate = new Date();
currentDate.setHours(0, 0, 0, 0);

function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function renderTasks() {
    const taskList = document.getElementById('task-list');
    taskList.innerHTML = '';
    const tasksForDate = tasks.filter(task => {
        const taskDate = new Date(task.date);
        taskDate.setHours(0, 0, 0, 0);
        return taskDate.getTime() === currentDate.getTime();
    });

    tasksForDate.forEach((task, index) => {
        const listItem = document.createElement('li');
        listItem.className = 'task-item flex items-center justify-between border-b py-2';

        const taskContent = document.createElement('span');
        taskContent.textContent = task.title;
        taskContent.className = task.completed ? 'line-through text-gray-500' : '';

        const completeButton = document.createElement('button');
        completeButton.textContent = task.completed ? 'Undo' : 'Complete';
        completeButton.className = 'text-sm text-blue-600 hover:underline';
        completeButton.addEventListener('click', () => {
            task.completed = !task.completed;
            saveTasks();
            renderTasks();
        });

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.className = 'text-sm text-red-600 hover:underline ml-2';
        deleteButton.addEventListener('click', () => {
            tasks = tasks.filter((_, i) => !(i === index && new Date(task.date).toDateString() === currentDate.toDateString()));
            saveTasks();
            renderTasks();
        });

        listItem.appendChild(taskContent);
        listItem.appendChild(completeButton);
        listItem.appendChild(deleteButton);
        taskList.appendChild(listItem);
    });

    document.getElementById('current-date').textContent = currentDate.toDateString();
}

function addTask() {
    const taskInput = document.getElementById('task-input').value;
    if (taskInput) {
        const newTask = { title: taskInput, completed: false, date: new Date(currentDate).toISOString() };
        tasks.push(newTask);
        saveTasks();
        renderTasks();
        document.getElementById('task-input').value = ''; // Clear input
        document.getElementById('addTaskModal').classList.add('hidden'); // Close modal
    }
}

function addTaskByVoice() {
    if (!('webkitSpeechRecognition' in window)) {
        alert('Your browser does not support speech recognition.');
        return;
    }
    const recognition = new webkitSpeechRecognition();
    recognition.lang = 'en-US';
    recognition.start();
    recognition.onresult = function (event) {
        const voiceInput = event.results[0][0].transcript;
        document.getElementById('task-input').value = voiceInput; // Pre-fill input with voice data
    };
}

function changeDate(offset) {
    currentDate.setDate(currentDate.getDate() + offset);
    renderTasks();
}

// Initial render of tasks
renderTasks();
