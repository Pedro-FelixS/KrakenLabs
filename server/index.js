const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const { conectarBD, sql } = require('./db');

const app = express();

app.use(cors());
app.use(express.json());

// Rota de teste simples
app.get('/api/dados', (req, res) => {
  return res.status(200).send('Servidor Express rodando com sucesso!');
});

// Rota de cadastro de usuários
app.post('/api/usuarios', async (req, res) => {
  const { nome, senha, cpf, dataNascimento, telefone, email } = req.body;

  // Validações básicas de campos
  if (!nome || !senha || !email || !cpf) {
    return res.status(400).send('Preencha todos os campos obrigatórios.');
  }

  if (senha.length < 8) {
    return res.status(400).send('A senha deve ter no mínimo 8 caracteres.');
  }

  try {
    const pool = await conectarBD();

    // Criptografa a senha antes de salvar no banco
    const senhaHash = await bcrypt.hash(senha, 10);

    // Insere os dados na tabela 'usuarios'
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

    // Erro de chave duplicada no SQL Server (CPF ou E-mail já existentes)
    if (erro.number === 2627 || erro.number === 2601) {
      return res.status(400).send('Este CPF ou E-mail já está cadastrado.');
    }

    return res.status(500).send('Erro ao salvar cadastro no banco de dados.');
  }
});

const PORTA = process.env.PORT || 5000;
app.listen(PORTA, () => console.log(`Servidor rodando na porta ${PORTA}`));