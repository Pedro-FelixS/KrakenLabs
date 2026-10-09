const { conectarBancoDeDados, sql } = require('../db');

class SalaModel {
  static async criarSala({ nome, codigo, capacidade, localizacao }) {
    const puxar = await conectarBancoDeDados();

    await puxar.request()
      .input('nome', sql.VarChar, nome)
      .input('codigo', sql.VarChar, codigo)
      .input('capacidade', sql.Int, Number(capacidade))
      .input('localizacao', sql.VarChar, localizacao)
      .query(`
        INSERT INTO recursos (nome, codigo, capacidade, localizacao)
        VALUES (@nome, @codigo, @capacidade, @localizacao)
      `);
  }
}

module.exports = SalaModel;