const express = require('express');
const router = express.Router();
const ProfessorController = require('../controllers/professorController');

router.post('/criar', ProfessorController.criar);
module.exports = router;
