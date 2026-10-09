const express = require('express');
const router = express.Router();
const LabController = require('../controllers/labsController');

router.post('/lab', LabController.cadastrar);

module.exports = router;