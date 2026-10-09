const express = require('express');
const router = express.Router();
const SalaController = require('../controllers/salaController');

router.post('/cadSala', SalaController.cadastrar);

module.exports = router;