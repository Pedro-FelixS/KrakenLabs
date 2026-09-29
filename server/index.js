const express = require('express');
const cors = require('cors');
const sql = require('mssql');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Configuração da conexão obtida através do arquivo .env
const dbConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_DATABASE,
  options: {
    encrypt: false,
    trustServerCertificate: true
  }
};

// Estabelece a conexão com o banco de dados SQL Server
sql.connect(dbConfig)
  .then(() => console.log('✅ Conectado ao SQL Server com sucesso!'))
  .catch(err => console.error('❌ Erro de conexão com o SQL Server:', err));

// Rota básica para testar o status do servidor
app.get('/api/dados', (req, res) => {
  res.json({ mensagem: 'Servidor Node.js rodando e conexão com BD configurada!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});