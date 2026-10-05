const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt'); // Importa a biblioteca de hash
const { conectarBD, sql } = require('./db');

const app = express();

app.use(cors());
app.use(express.json());

// Rota de Cadastro com Senha Segura
app.post('/api/usuarios', async (req, res) => {
  const { nome, senha, cpf, dataNascimento, telefone, email } = req.body;

  // 1. Validação simples de campos e tamanho da senha
  if (!nome || !senha || !email || !cpf) {
    return res.status(400).json({ mensagem: 'Preencha todos os campos obrigatórios.' });
  }

  if (senha.length < 8) {
    return res.status(400).json({ mensagem: 'A senha deve ter no mínimo 8 caracteres.' });
  }

  try {
    const pool = await conectarBD();

    // 2. Criptografa a senha antes de salvar (Custo de hash: 10)
    const senhaHash = await bcrypt.hash(senha, 10);

    // 3. Insere no SQL Server salvando o HASH e não a senha limpa
    await pool.request()
      .input('nome', sql.VarChar, nome)
      .input('senha', sql.VarChar, senhaHash) // Salva no campo Senha do BD
      .input('cpf', sql.VarChar, cpf)
      .input('dataNascimento', sql.Date, dataNascimento || null)
      .input('telefone', sql.VarChar, telefone || null)
      .input('email', sql.VarChar, email)
      .query(`
        INSERT INTO Usuarios (Nome, Senha, CPF, DataNascimento, Telefone, Email)
        VALUES (@nome, @senha, @cpf, @dataNascimento, @telefone, @email)
      `);

    return res.status(201).json({ mensagem: 'Usuário cadastrado com sucesso!' });

  } catch (erro) {
    console.error('Erro ao cadastrar usuário:', erro);
    return res.status(500).json({ mensagem: 'Erro ao salvar cadastro no banco de dados.' });
  }
});

const PORTA = process.env.PORT || 5000;
app.listen(PORTA, () => console.log(`Servidor rodando na porta ${PORTA}`));