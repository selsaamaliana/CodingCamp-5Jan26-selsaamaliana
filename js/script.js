let todos = [];

// Notification permission
if ("Notification" in window) {
    Notification.requestPermission();
}

// Add Todo
function addTodo() {
    const task = document.getElementById('todo-input').value;
    const date = document.getElementById('todo-date').value;
    const time = document.getElementById('todo-time').value;

    if (!task || !date) {
        alert("Todo and date are required!");
        return;
    }

    const todo = {
        task,
        date,
        time,
        completed: false,
        emoji: getEmoji(task),
        color: getRandomColor()
    };

    todos.push(todo);
    renderTodos();
    scheduleReminder(todo);

    document.getElementById('todo-input').value = '';
    document.getElementById('todo-date').value = '';
    document.getElementById('todo-time').value = '';
}

// Render Todos
function renderTodos(filter = 'all') {
    const list = document.getElementById('todo-list');
    list.innerHTML = '';

    let filtered = todos;
    if (filter === 'completed') filtered = todos.filter(t => t.completed);
    if (filter === 'pending') filtered = todos.filter(t => !t.completed);

    if (filtered.length === 0) {
        list.innerHTML = '<li class="text-gray-500">No todos available</li>';
        return;
    }

    filtered.forEach((todo, i) => {
        list.innerHTML += `
        <li class="p-3 rounded mb-2" style="background:${todo.color}">
            <label class="flex gap-2 items-center">
                <input type="checkbox" ${todo.completed ? 'checked' : ''} onchange="toggleComplete(${i})">
                <span class="${todo.completed ? 'line-through opacity-60' : ''}">
                    ${todo.emoji} ${todo.task}
                </span>
            </label>
            <small>${todo.date} ${todo.time || ''}</small>
        </li>`;
    });
}

// Toggle complete
function toggleComplete(index) {
    todos[index].completed = !todos[index].completed;
    renderTodos(document.getElementById('filter').value);
}

// Remove completed
function removeCompleted() {
    todos = todos.filter(t => !t.completed);
    renderTodos();
}

// Filter dropdown
document.getElementById('filter').addEventListener('change', function () {
    renderTodos(this.value);
});

// Reminder
function scheduleReminder(todo) {
    if (!todo.time) return;

    const reminderTime = new Date(`${todo.date}T${todo.time}`);
    const delay = reminderTime - new Date();

    if (delay > 0) {
        setTimeout(() => {
            new Notification("⏰ Todo Reminder", {
                body: `${todo.emoji} ${todo.task}`
            });
        }, delay);
    }
}

// Emoji
function getEmoji(task) {
    const text = task.toLowerCase();

    const emojiMap = [
        { keywords: ['belajar', 'study', 'learn', 'homework', 'kuliah', 'sekolah', 'exam', 'ujian'], emoji: '📚' },
        { keywords: ['kerja', 'work', 'office', 'meeting', 'deadline', 'project'], emoji: '💼' },
        { keywords: ['berenang', 'swim', 'swimming'], emoji: '🏊‍♂️' },
        { keywords: ['lari', 'run', 'running', 'jogging'], emoji: '🏃‍♂️' },
        { keywords: ['olahraga', 'gym', 'fitness', 'workout'], emoji: '💪' },
        { keywords: ['makan', 'eat', 'lunch', 'dinner', 'sarapan'], emoji: '🍽️' },
        { keywords: ['minum', 'drink'], emoji: '🥤' },
        { keywords: ['tidur', 'sleep', 'istirahat', 'nap'], emoji: '😴' },
        { keywords: ['belanja', 'shopping', 'shop'], emoji: '🛒' },
        { keywords: ['masak', 'cook', 'cooking'], emoji: '👩‍🍳' },
        { keywords: ['nonton', 'watch', 'movie', 'film'], emoji: '🎬' },
        { keywords: ['musik', 'music', 'listen'], emoji: '🎵' },
        { keywords: ['travel', 'jalan', 'liburan', 'vacation'], emoji: '✈️' },
        { keywords: ['ibadah', 'doa', 'pray', 'shalat'], emoji: '🙏' },
        { keywords: ['bersih', 'clean', 'cleaning'], emoji: '🧹' },
        { keywords: ['coding', 'code', 'programming', 'ngoding'], emoji: '💻' },
        { keywords: ['design', 'desain'], emoji: '🎨' },
        { keywords: ['game', 'gaming', 'main'], emoji: '🎮' }
    ];

    for (const item of emojiMap) {
        if (item.keywords.some(keyword => text.includes(keyword))) {
            return item.emoji;
        }
    }

    return '📝'; // default
}


// Random color
function getRandomColor() {
    const colors = ['#fde68a', '#bfdbfe', '#bbf7d0', '#fecaca', '#ddd6fe'];
    return colors[Math.floor(Math.random() * colors.length)];
}

// PWA
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js');
}
