const { Client } = require('pg');

exports.handler = async (event) => {
    const client = new Client({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false }
    });
    await client.connect();

    try {
        if (event.httpMethod === 'GET') {
            const res = await client.query('SELECT * FROM todos ORDER BY id DESC');
            return { statusCode: 200, body: JSON.stringify(res.rows) };
        } 
        
        if (event.httpMethod === 'POST') {
            const { text } = JSON.parse(event.body);
            await client.query('INSERT INTO todos (text) VALUES ($1)', [text]);
            return { statusCode: 201, body: 'Task Criada' };
        }
    } catch (err) {
        return { statusCode: 500, body: err.toString() };
    } finally {
        await client.end();
    }
};