const express = require('express');
const { conectarBancoDeDados, sql} = require('./db')

const cadastroSala = express();

cadastroSala.post('/paginaPrincipal', async(req, res) => {
    const{nome, codigo, capacidade, localizacao} = req.body;
    if (!nome || !codigo || !capacidade || !localizacao){
        res.status(200).send("Preencha os campos adequadamente!");
    }
    try{
        const puxar = await conectarBancoDeDados();
        await puxar.request()
        .input('nome', sql.VarChar, nome)
        .input('codigo', sql.VarChar, codigo)
        .input('capacidade', sql.VarChar, capacidade)
        .input('localização', sql.VarChar, localizacao)
        
    }
    catch (erro){
        console.error(erro);
        res.status(500).send("Não foi possível encontrar o laboratório ou sala!");
    }
})