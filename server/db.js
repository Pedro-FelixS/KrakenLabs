const sql = require('mssql');
require('dotenv').config();

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER || 'regulus.cotuca.unicamp.br',
  database: process.env.DB_DATABASE,
  port: parseInt(process.env.DB_PORT) || 1433,
  options: {
    encrypt: false,
    trustServerCertificate: true,
    connectTimeout: 30000,
    requestTimeout: 30000
  }
};

let poolPromise;

async function conectarBancoDeDados() {
  try {
    if (!poolPromise) {
      poolPromise = sql.connect(config);
    }
    const pool = await poolPromise;
    console.log('Conectado ao SQL Server (Regulus) com sucesso!');
    return pool;
  } catch (erro) {
    poolPromise = null; // Reseta em caso de falha para tentar novamente se necessário
    console.error('Falha na conexão com o SQL Server:', erro.message);
    throw erro;
  }
}

module.exports = { conectarBancoDeDados, sql };