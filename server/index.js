const express = require('express');
const cors = require('cors');
const { conectarBD, sql } = require('./db');

const app = express();

app.use(cors());
app.use(express.json());

// Rota para cadastrar novos usuários
app.post('/api/usuarios', async (req, res) => {
  const { nome, cpf, email, telefone } = req.body;

  // Validação rápida de campos obrigatórios
  if (!nome?.trim() || !cpf?.trim() || !email?.trim()) {
    return res.status(400).json({ 
      mensagem: 'Por favor, preencha os campos obrigatórios (Nome, CPF e E-mail).' 
    });
  }

  try {
    const pool = await conectarBD();

    await pool.request()
      .input('nome', sql.VarChar, nome.trim())
      .input('cpf', sql.VarChar, cpf.trim())
      .input('email', sql.VarChar, email.trim())
      .input('telefone', sql.VarChar, telefone?.trim() || null)
      .query(`
        INSERT INTO Usuarios (Nome, CPF, Email, Telefone)
        VALUES (@nome, @cpf, @email, @telefone)
      `);

    return res.status(201).json({ 
      mensagem: 'Usuário cadastrado com sucesso!' 
    });

  } catch (erro) {
    console.error('Erro ao salvar usuário:', erro);
    return res.status(500).json({ 
      mensagem: 'Não foi possível salvar o cadastro no momento. Tente novamente mais tarde.' 
    });
  }
});

const PORTA = process.env.PORT || 5000;
app.listen(PORTA, () => console.log(`Backend rodando na porta ${PORTA}`));