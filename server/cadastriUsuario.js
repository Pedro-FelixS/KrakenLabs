const express = require('express');
const bcrypt = require('bcrypt');
const { conectarBancoDeDados, sql } = require('./db');

const router = express.Router();

router.post('/api/usuarios', async (req, res) => {
  const { nome, senha, cpf, dataNascimento, telefone, email } = req.body;

  if (!nome || !senha || !email || !cpf) {
    return res.status(400).send('Preencha todos os campos obrigatórios.');
  }

  if (senha.length < 8) {
    return res.status(400).send('A senha deve ter no mínimo 8 caracteres.');
  }
 
  const cpfApenasNumeros = cpf.replace(/\D/g, '');
  if (cpfApenasNumeros.length !== 11) {
    return res.status(400).send('CPF inválido. O CPF deve conter exatamente 11 dígitos.');
  }

  try {
    const pool = await conectarBancoDeDados();

    const senhaHash = await bcrypt.hash(senha, 10);

    await pool.request()
      .input('cpf', sql.VarChar, cpf)
      .input('nome', sql.VarChar, nome)
      .input('dataniver', sql.Date, dataNascimento)
      .input('cel', sql.VarChar, telefone)
      .input('email', sql.VarChar, email)
      .input('senha', sql.VarChar, senhaHash)
      .query(`
        INSERT INTO usuarios (cpf, nome, dataniver, cel, email, senha)
        VALUES (@cpf, @nome, @dataniver, @cel, @email, @senha)
      `);

    return res.status(201).send('Usuário cadastrado com sucesso!');

  } catch (erro) {
    console.error('Erro ao cadastrar:', erro);

    if (erro.number === 2627 || erro.number === 2601) {
      return res.status(400).send('Este CPF ou E-mail já está cadastrado.');
    }

    return res.status(500).send('Erro ao salvar cadastro no banco de dados.');
  }
});

module.exports = router;