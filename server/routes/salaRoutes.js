const express = require('express');
const router = express.Router();
const SalaController = require('../controllers/salasController');

router.post('/api/sala', SalaController.cadastrar);

module.exports = router;