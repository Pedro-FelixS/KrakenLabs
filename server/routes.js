const express = require('express');
const { conectarBancoDeDados, sql } = require('./db');
const bcrypt = require('bcrypt');

const routes = express.Router();

const professorRoutes = require('./routes/professorRoutes');
const alunoRoutes = require('./routes/alunoRoutes');
const salasRoutes = require('./routes/salaRoutes');
const labsRoutes = require('./routes/labsRoutes');
const statusRoutes = require('./routes/statusRoutes');
const reservaRoutes = require('./routes/reservaRoutes');

// Importação do Controller de Consultas de Reservas
const ConsultaController = require('./controllers/consultaController');

routes.post('/login', async (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).send('Preencha os campos de e-mail e senha!');
  }

  try {
    const puxar = await conectarBancoDeDados();
    const resultado = await puxar.request()
      .input('email', sql.VarChar, email)
      .query("SELECT cpf, nome, email, senha, ISNULL(tipo, 'Aluno') as tipo FROM usuarios WHERE email = @email");

    const usuarios = resultado.recordset;
    if (usuarios.length === 0) {
      return res.status(401).send('E-mail incorreto, tente novamente!');
    }

    const usuarioCorreto = usuarios[0];
    const senhaDoUsuario = await bcrypt.compare(senha, usuarioCorreto.senha);

    if (!senhaDoUsuario) {
      return res.status(401).send('Senha incorreta, tente novamente!');
    }

    // Retorna os dados essenciais do usuário e seu perfil ('Aluno' ou 'Professor')
    return res.status(200).json({
      mensagem: "O login foi realizado com sucesso!",
      usuario: {
        cpf: usuarioCorreto.cpf,
        nome: usuarioCorreto.nome,
        email: usuarioCorreto.email,
        tipo: usuarioCorreto.tipo
      }
    });

  } catch (erro) {
    console.error("Erro no login:", erro);
    return res.status(500).send("Falha ao tentar buscar seu usuário, tente novamente ou se cadastre caso não tiver!");
  }
});

// Nova Rota para Consulta de Reservas com Filtros
routes.get('/consultar', ConsultaController.buscar);

routes.use(professorRoutes);
routes.use(alunoRoutes);
routes.use(salasRoutes);
routes.use(labsRoutes);
routes.use(statusRoutes);
routes.use('/reservas', reservaRoutes);

module.exports = routes;