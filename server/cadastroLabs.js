const express = require('express');
const { conectarBancoDeDados, sql} = require('./db')

const routes = express.Router();

routes.post('/cadLab', async(req, res) => {
    const{nome, codigo, capacidade, localizacao} = req.body;
    if (!nome || !codigo || !capacidade || !localizacao){
       return  res.status(400).send("Preencha os campos adequadamente!");
    }
    try{
        const puxar = await conectarBancoDeDados();
        await puxar.request()
        .input('nome', sql.VarChar, nome)
        .input('codigo', sql.VarChar, codigo)
        .input('capacidade', sql.Int, Number(capacidade))
        .input('localizacao', sql.VarChar, localizacao)
        .query(`
        INSERT INTO recursos (nome, codigo, capacidade, localizacao)
        VALUES (@nome, @codigo, @capacidade, @localizacao)
      `);
    return res.status(201).send('laboratório cadastrado com sucesso!');

        
    }
    catch (erro){
        console.error('Erro no cadastro de recurso:', erro);
        if (erro.number === 2627 || erro.number === 2601) {
      return res.status(400).send('Já existe um recurso cadastrado com este código.');
    }

    return res.status(500).send("Não foi possível cadastrar o laboratório ou sala.");
    }
});

module.exports = routes;