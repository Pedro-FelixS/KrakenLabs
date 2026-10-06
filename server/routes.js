const express = require('express');

const routes = express.Router();

routes.post('/login', (req, res) => {
    
    res.send('Login endpoint');
});

module.exports = routes;