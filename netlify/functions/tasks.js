const { Client } = require('pg');

exports.handler = async (event, context) => {
  // Configuração da conexão
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    await client.connect();

    // Rota GET (Listar)
    if (event.httpMethod === 'GET') {
      const res = await client.query('SELECT * FROM todos ORDER BY id ASC');
      return {
        statusCode: 200,
        body: JSON.stringify(res.rows),
      };
    }

    // Rota POST (Criar)
    if (event.httpMethod === 'POST') {
      const { text } = JSON.parse(event.body);
      const res = await client.query('INSERT INTO todos (text) VALUES ($1) RETURNING *', [text]);
      return {
        statusCode: 201,
        body: JSON.stringify(res.rows[0]),
      };
    }

    return { statusCode: 405, body: 'Método não permitido' };

  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  } finally {
    await client.end();
  }
};