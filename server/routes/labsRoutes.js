const express = require('express');
const router = express.Router();
const LabController = require('../controllers/labController');

router.post('/cadLab', LabController.cadastrar);

module.exports = router;