const express = require('express');
const router = express.Router();
const UsuarioController = require('../controllers/usuarioController');

router.post('/criar', UsuarioController.criar);

module.exports = router;