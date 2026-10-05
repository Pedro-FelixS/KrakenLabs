const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const { conectarBD, sql } = require('./db');

const app = express();

app.use(cors());
app.use(express.json());


app.get('/api/dados', (req, res) => {
  res.json({ mensagem: 'Servidor Express rodando com sucesso!' });
});

app.post('/api/usuarios', async (req, res) => {
  const { nome, senha, cpf, dataNascimento, telefone, email } = req.body;


  if (!nome || !senha || !email || !cpf) {
    return res.status(400).json({ mensagem: 'Preencha todos os campos obrigatórios.' });
  }

  if (senha.length < 8) {
    return res.status(400).json({ mensagem: 'A senha deve ter no mínimo 8 caracteres.' });
  }

  try {
    const pool = await conectarBD();

   
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

    return res.status(201).json({ mensagem: 'Usuário cadastrado com sucesso!' });

  } catch (erro) {
    console.error('Erro ao cadastrar:', erro);

    
    if (erro.number === 2627 || erro.number === 2601) {
      return res.status(400).json({ mensagem: 'Este CPF ou E-mail já está cadastrado.' });
    }

    return res.status(500).json({ mensagem: 'Erro ao salvar cadastro no banco de dados.' });
  }
});


const PORTA = process.env.PORT || 5000;
app.listen(PORTA, () => console.log(`🚀 Servidor rodando na porta ${PORTA}`));