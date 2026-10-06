const sql = require('mssql');
require('dotenv').config(); 


const config = {
  user: process.env.DB_USER,           
  password: process.env.DB_PASSWORD,  
  server: process.env.DB_SERVER || 'regulus.cotuca.unicamp.br',
  database: process.env.DB_DATABASE || 'KrakenLabsDB',
  port: 1433,
  options: {
    encrypt: false,                     
    trustServerCertificate: true,       
    connectTimeout: 30000,              
    requestTimeout: 30000
  }
};

async function conectarBD() {
  try {
    const pool = await sql.connect(config);
    console.log('Conectado ao SQL Server com sucesso!');
    return pool;
  } catch (erro) {
    console.error('Falha na conexão com o SQL Server:', erro.message);
    throw erro;
  }
}

module.exports = { conectarBD, sql };