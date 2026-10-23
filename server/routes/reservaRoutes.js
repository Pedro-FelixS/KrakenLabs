
const express = require('express');
const router = express.Router();

const ReservaController = require('../controllers/reservaController');

router.get('/recursos', ReservaController.listarRecursos);

router.get('/status', ReservaController.listarReservas);

router.post('/criar', ReservaController.criarReserva);

module.exports = router;
