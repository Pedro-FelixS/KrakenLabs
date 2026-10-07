const express = require('express');
const { conectarBancoDeDados, sql} = require('./db')

const cadastroSala = express();

cadastroSala.post('/paginaPrincipal', async(req, res) => {
    
})