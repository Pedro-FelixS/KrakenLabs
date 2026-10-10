const express = require('express');
const router = express.Router();
const StatusController = require('../controllers/statusController');

// Altera o status de uma sala ou laboratório
router.post('/status/alterar', StatusController.alterarStatus);

// Lista todos os laboratórios e salas com seus status atuais
router.get('/status', StatusController.listarStatus);

module.exports = router;