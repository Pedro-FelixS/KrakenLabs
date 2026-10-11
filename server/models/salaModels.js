const { conectarBancoDeDados, sql } = require('../db');
class SalaModel {
  static async criarSala({ nome, codigo, capacidade, localizacao }) {
    const puxar = await conectarBancoDeDados();

    await puxar.request()
      .input('nome', sql.VarChar, nome)
      .input('codigo', sql.VarChar, codigo)
      .input('capacidade', sql.Int, Number(capacidade))
      .input('localizacao', sql.VarChar, localizacao)
      .input('ehlaboratorio', sql.Bit, 0)
      .query(`
        INSERT INTO recursos (nome, codigo, capacidade, localizacao, ehlaboratorio)
        VALUES (@nome, @codigo, @capacidade, @localizacao, 0)
      `);
  }
}

module.exports = SalaModel;