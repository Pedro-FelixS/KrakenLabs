const express = require('express');
const router = express.Router();
const ConsultaController = require('../controllers/consultaController');

router.get('/reservas', ConsultaController.filtrar);

module.exports = router;