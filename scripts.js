const apiPath = '/.netlify/functions/tasks';

async function loadTasks() {
    const res = await fetch(apiPath);
    const tasks = await res.json();
    const list = document.getElementById('taskList');
    list.innerHTML = tasks.map(t => `<li>${t.text}</li>`).join('');
}

async function addTask() {
    const input = document.getElementById('taskInput');
    if (!input.value) return;

    await fetch(apiPath, {
        method: 'POST',
        body: JSON.stringify({ text: input.value })
    });
    input.value = '';
    loadTasks();
}

loadTasks();