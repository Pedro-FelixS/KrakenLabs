const express = require('express');
const router = express.Router();
const StatusController = require('../controllers/statusController');

router.post('/status/alterar', StatusController.alterarStatus);

router.get('/status', StatusController.listarStatus);

module.exports = router;