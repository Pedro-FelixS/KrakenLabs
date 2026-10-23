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

let poolPromise = null;

// Garante que o pool de conexão seja reutilizado
function obterPool() {
  if (!poolPromise) {
    poolPromise = sql.connect(config).catch((erro) => {
      poolPromise = null; // Reseta em caso de falha de conexão
      console.error('Falha na conexão com o SQL Server:', erro.message);
      throw erro;
    });
  }
  return poolPromise;
}

// Objeto de banco de dados compatível com o constructor da classe (this._db.query)
const db = {
  query: function (sqlQuery, callback) {
    obterPool()
      .then((pool) => {
        return pool.request().query(sqlQuery);
      })
      .then((resultado) => {
        // Sucesso: passa null no erro e o recordset no resultado
        if (typeof callback === 'function') {
          callback(null, resultado.recordset);
        }
      })
      .catch((erro) => {
        // Falha: passa o objeto de erro para o callback
        console.error('Erro ao executar query no SQL Server:', erro.message);
        if (typeof callback === 'function') {
          callback(erro, null);
        }
      });
  }
};

module.exports = db;