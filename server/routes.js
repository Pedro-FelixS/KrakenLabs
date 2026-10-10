const express = require('express');
const { conectarBancoDeDados, sql} = require('./db')
const bcrypt = require('bcrypt');

const routes = express.Router();

const usuarioRoutes = require('./routes/usuarioRoutes');
const salasRoutes = require('./routes/salaRoutes');
const labsRoutes = require('./routes/labsRoutes');

routes.post('/login', async(req, res) => {
   const { email, senha } = req.body;

    if (!email || !senha) {
        return res.status(400).send('Preencha os campos de e-mail e senha!');
    }

    try {
        const puxar = await conectarBancoDeDados();
        const resultado = await puxar.request()
            .input('email', sql.VarChar, email)
            .query('select * from usuarios where email = @email');

        const usuarios = resultado.recordset;
        if (usuarios.length === 0) {
            return res.status(401).send('email incorreto, tente novamente!');
        }

        const usuarioCorreto = usuarios[0];
        const senhaDoUsuario = await bcrypt.compare(senha, usuarioCorreto.senha);

        if (!senhaDoUsuario) {
            return res.status(401).send('senha incorreta, tente novamente!');
        }

        return res.status(200).send("o login foi realizado com sucesso!");

    } catch (erro) {
        console.error(erro);
        return res.status(500).send("Falha ao tentar buscar seu usuário, tente novamente ou se cadastre caso não tiver!");
    }
});

routes.use(usuarioRoutes);
routes.use(salaRoutes);
routes.use(labsRoutes);


module.exports = routes;