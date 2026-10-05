const sql = require('mssql');
require('dotenv').config();

const dbConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_DATABASE,
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
};

// Gerencia o pool de conexões do SQL Server
const conectarBD = async () => {
  try {
    const pool = await sql.connect(dbConfig);
    return pool;
  } catch (erro) {
    console.error('Falha na conexão com o SQL Server:', erro.message);
    throw erro;
  }
};

module.exports = { conectarBD, sql };