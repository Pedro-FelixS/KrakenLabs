const express = require('express');
const router = express.Router();
const ReservaController = require('../controllers/reservaController');

// Rota para buscar laboratórios/salas para o select
router.get('/recursos', ReservaController.listarRecursos);

// Rota para listar todas as reservas criadas
router.get('/', ReservaController.listarReservas);

// Rota para cadastrar uma nova reserva
router.post('/criar', ReservaController.criarReserva);

module.exports = router;