const express = require('express');
const cors = require('cors');
const routes = require('./routes'); // Importa o routes.js que reúne todas as suas rotas

const app = express();

app.use(cors());
app.use(express.json());

// Aplica as rotas no app
app.use(routes);

const PORTA = process.env.PORT || 5000;
app.listen(PORTA, () => console.log(`Servidor rodando na porta ${PORTA}`));