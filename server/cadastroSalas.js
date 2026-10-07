const express = require('express');
const { conectarBancoDeDados, sql} = require('./db')

const cadastroSala = express();

cadastroSala.post('/paginaPrincipal', async(req, res) => {
    const{sala, laboratório} = req.body;
    try{
        const puxar = await conectarBancoDeDados();
        await puxar.request()
        .input('nome', sql.VarChar, nomeSala)
        .input('codigo', sql.VarChar, codigo)
    }
    catch (erro){
        console.error(erro);
        res.status(500).send("Não foi possível encontrar o laboratório ou sala!");
    }
})