const express = require('express');
const { conectarBancoDeDados, sql} = require('./db')
const bcrypt = require('bcrypt');

const routes = express.Router();

routes.post('/login', async(req, res) => {
    const {email, senha} = req.body;
    try{
        const puxar = await conectarBancoDeDados();
        const resultado = await puxar.request().input('email', sql.VarChar, email).query('select * from usuarios where email = @email');
        
        const usuarios = resultado.recordset;
        if(usuarios.length == 0){
            return res.status(401).send('email incorreto, tente novamente!');
        }
        const usuarioCorreto = usuarios[0];
        const senhaDoUsuario = await bcrypt.compare(senha, usuarioCorreto.senha);

        if (!senhaDoUsuario){
            return res.status(401).send('senha incorreta, tente novamente!');
        }
        return res.status(200).send("o login foi realizado com sucesso!");

        
    }
    catch (erro){
        console.error(erro);
        res.status(500).send("Falha ao tentar buscar seu usuário, tente novamente ou se cadastre caso não tiver!");
    }
});


module.exports = routes;