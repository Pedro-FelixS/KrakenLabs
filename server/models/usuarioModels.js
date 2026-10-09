const { conectarBancoDeDados, sql } = require('../db');

class UsuarioModel {
  static async criarUsuario({ cpf, nome, dataNascimento, telefone, email, senhaHash }) {
    const pool = await conectarBancoDeDados();

    await pool.request()
      .input('cpf', sql.VarChar, cpf)
      .input('nome', sql.VarChar, nome)
      .input('dataniver', sql.Date, dataNascimento || null)
      .input('cel', sql.VarChar, telefone || null)
      .input('email', sql.VarChar, email)
      .input('senha', sql.VarChar, senhaHash)
      .query(`
        INSERT INTO usuarios (cpf, nome, dataniver, cel, email, senha)
        VALUES (@cpf, @nome, @dataniver, @cel, @email, @senha)
      `);
  }
}

module.exports = UsuarioModel;