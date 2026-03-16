const apiPath = '/.netlify/functions/tasks';

async function loadTasks() {
    try {
        const res = await fetch(apiPath);
        const tasks = await res.json();
        const list = document.getElementById('taskList');
        list.innerHTML = '';

        tasks.forEach(task => {
            const li = document.createElement('li');
            li.innerHTML = `
                <span class="task-text">${task.text}</span>
                <div class="actions">
                    <button class="btn-action btn-edit" title="Editar" onclick="editTask(${task.id}, '${task.text}')">
                        <i class="fas fa-pencil-alt"></i>
                    </button>
                    <button class="btn-action btn-delete" title="Excluir" onclick="deleteTask(${task.id})">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            `;
            list.appendChild(li); // Adiciona ao final da lista (vai para baixo)
        });
    } catch (err) {
        console.error("Erro ao carregar:", err);
    }
}

async function addTask() {
    const input = document.getElementById('taskInput');
    const text = input.value.trim();
    if (!text) return;

    await fetch(apiPath, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
    });
    
    input.value = '';
    loadTasks();
}

async function deleteTask(id) {
    await fetch(apiPath, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
    });
    loadTasks();
}

async function editTask(id, oldText) {
    const newText = prompt("Edite sua tarefa:", oldText);
    if (newText !== null && newText.trim() !== "" && newText !== oldText) {
        await fetch(apiPath, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, text: newText.trim() })
        });
        loadTasks();
    }
}

loadTasks();