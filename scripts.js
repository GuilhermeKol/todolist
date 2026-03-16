const apiPath = '/.netlify/functions/tasks';

async function addTask() {
    const input = document.getElementById('taskInput');
    const text = input.value.trim();
    
    if (!text) return;

    try {
        const response = await fetch(apiPath, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Erro desconhecido');
        }

        input.value = '';
        await loadTasks(); // Recarrega a lista
    } catch (err) {
        alert("Erro ao adicionar: " + err.message);
        console.error(err);
    }
}