const express = require('express');
const { conectarBancoDeDados, sql} = require('./db')

const app = express();
app.use(express.json());
const cadastroSala = express();

cadastroSala.post('/paginaPrincipal', async(req, res) => {
    const{nome, codigo, capacidade, localizacao} = req.body;
    if (!nome || !codigo || !capacidade || !localizacao){
        res.status(400).send("Preencha os campos adequadamente!");
    }
    else if (nome.length == 0){
        res.status(400).send("você não preencheu o nome!");
    }
    try{
        const puxar = await conectarBancoDeDados();
        await puxar.request()
        .input('nome', sql.VarChar, nome)
        .input('codigo', sql.VarChar, codigo)
        .input('capacidade', sql.VarChar, capacidade)
        .input('localização', sql.VarChar, localizacao)
        .query(`
        INSERT INTO recursos (nome, codigo, capacidade, localização)
        VALUES (@nome, @codigo, @capacidade, @localização)
      `);
    return res.status(201).send('laboratório cadastrado com sucesso!');

        
    }
    catch (erro){
        console.error(erro);
        res.status(500).send("Não foi possível criar o laboratório ou sala!");
    }
})