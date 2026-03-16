const { Client } = require('pg');

exports.handler = async (event) => {
    // 1. Verificar se a variável de ambiente existe
    if (!process.env.DATABASE_URL) {
        return { statusCode: 500, body: JSON.stringify({ error: "Variável DATABASE_URL não configurada no Netlify!" }) };
    }

    const client = new Client({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false }
    });
    
    try {
        await client.connect();
        const method = event.httpMethod;
        let body = {};
        
        if (event.body) {
            body = JSON.parse(event.body);
        }

        if (method === 'GET') {
            const res = await client.query('SELECT * FROM todos ORDER BY id ASC');
            return { statusCode: 200, body: JSON.stringify(res.rows) };
        }

        if (method === 'POST') {
            await client.query('INSERT INTO todos (text) VALUES ($1)', [body.text]);
            return { statusCode: 201, body: JSON.stringify({ message: "Sucesso" }) };
        }

        // ... manter os outros métodos (PUT, DELETE) ...

        return { statusCode: 405, body: 'Método não permitido' };
    } catch (err) {
        return { 
            statusCode: 500, 
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ error: err.message }) 
        };
    } finally {
        await client.end();
    }
};