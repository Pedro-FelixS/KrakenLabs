const express = require('express');
const router = express.Router();
const ConsultaController = require('../controllers/consultaController');

// Rota para buscar as reservas com filtros opcionais via URL
router.get('/consultar', ConsultaController.buscar);

module.exports = router;