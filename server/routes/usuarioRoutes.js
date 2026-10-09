const express = require('express');
const router = express.Router();
const UsuarioController = require('../controllers/usuarioController');

router.post('/api/usuarios', UsuarioController.cadastrar);

module.exports = router;