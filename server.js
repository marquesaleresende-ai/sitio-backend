const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Ligação ao Supabase PostgreSQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || "postgresql://postgres:amazonpc140197@db.lhgylrrvjgkdwrzvxuzf.supabase.co:5432/postgres",
  ssl: { rejectUnauthorized: false }
});

pool.connect((err, client, release) => {
  if (err) {
    return console.error('Erro ao conectar ao Supabase PostgreSQL:', err.stack);
  }
  console.log('Conectado com sucesso ao Supabase PostgreSQL!');
  release();
});

app.get('/', (req, res) => {
  res.send('API do Sítio Florentino a funcionar em pleno!');
});

// Rota para buscar todos os dados necessários para o site
app.get('/api/dados', async (req, res) => {
  try {
    const usersResult = await pool.query('SELECT * FROM users');
    const roomsResult = await pool.query('SELECT * FROM rooms');
    const guestsResult = await pool.query('SELECT * FROM guests');
    const historyResult = await pool.query('SELECT * FROM history ORDER BY created_at DESC');
    const lostItemsResult = await pool.query('SELECT * FROM lost_items');

    res.json({
      users: usersResult.rows,
      rooms: roomsResult.rows,
      guests: guestsResult.rows,
      history: historyResult.rows,
      lost_items: lostItemsResult.rows
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar dados da base de dados.' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});