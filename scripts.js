const apiPath = '/.netlify/functions/tasks';

async function loadTasks() {
    const res = await fetch(apiPath);
    const tasks = await res.json();
    const list = document.getElementById('taskList');
    list.innerHTML = '';

    tasks.forEach(task => {
        const li = document.createElement('li');
        li.innerHTML = `
            <span class="task-text ${task.completed ? 'completed' : ''}" onclick="toggleTask(${task.id}, ${task.completed})">
                ${task.text}
            </span>
            <div class="actions">
                <button class="btn-action btn-edit" onclick="editTask(${task.id}, '${task.text}')"><i class="fas fa-edit"></i></button>
                <button class="btn-action btn-delete" onclick="deleteTask(${task.id})"><i class="fas fa-trash"></i></button>
            </div>
        `;
        list.appendChild(li);
    });
}

async function addTask() {
    const input = document.getElementById('taskInput');
    if (!input.value) return;
    await fetch(apiPath, { method: 'POST', body: JSON.stringify({ text: input.value }) });
    input.value = '';
    loadTasks();
}

async function deleteTask(id) {
    if (confirm('Excluir esta tarefa?')) {
        await fetch(apiPath, { method: 'DELETE', body: JSON.stringify({ id }) });
        loadTasks();
    }
}

async function toggleTask(id, completed) {
    await fetch(apiPath, { method: 'PUT', body: JSON.stringify({ id, completed: !completed }) });
    loadTasks();
}

async function editTask(id, oldText) {
    const newText = prompt("Editar tarefa:", oldText);
    if (newText && newText !== oldText) {
        await fetch(apiPath, { method: 'PUT', body: JSON.stringify({ id, text: newText }) });
        loadTasks();
    }
}

loadTasks();