const express = require('express');
const router = express.Router();
const ReservaController = require('../controllers/reservaController');

// Rota específica dos recursos SEMPRE em primeiro
router.get('/recursos', ReservaController.listarRecursos);

router.get('/', ReservaController.listarReservas);
router.post('/criar', ReservaController.criarReserva);

module.exports = router;