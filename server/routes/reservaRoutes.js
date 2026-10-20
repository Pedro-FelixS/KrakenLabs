const express = require('express');
const router = express.Router();
const ReservaController = require('../controllers/reservaController');

// Rota específica para listar os recursos/salas/labs livres
router.get('/recursos', ReservaController.listarRecursos);

// Rota para listar todas as reservas criadas
router.get('/', ReservaController.listarReservas);

// Rota para criar uma nova reserva
router.post('/criar', ReservaController.criarReserva);

module.exports = router;