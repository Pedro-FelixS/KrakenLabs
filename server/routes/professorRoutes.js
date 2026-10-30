const express = require('express');
const router = express.Router();
const ProfessorController = require('../controllers/professorController');

router.post('/professores/criar', ProfessorController.criar);

module.exports = router;
