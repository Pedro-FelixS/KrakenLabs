const express = require('express');
const router = express.Router();
const AlunoController = require('../controllers/alunoController');

router.post('/alunos/criar', AlunoController.criar);

module.exports = router;