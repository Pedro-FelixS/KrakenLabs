const express = require('express');
const { conectarBancoDeDados, sql} = require('./db')

const routes = express.Router();

routes.post('/login', async(req, res) => {
    const {email, password} = req.body;
    try{
        const puxar = await conectarBancoDeDados();
        const resultado = await puxar.request().input('email', sql.VarChar, email)
        .query('select * from usuarios where email == @email');
        const usuarios = resultado.recordset;
        res.send('email');
    }
    catch (erro){
        console.error(erro);
        res.status(500).send("Falha ao tentar buscar usuário no banco de dados, tente novamente!");
    }
});

module.exports = routes;