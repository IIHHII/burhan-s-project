const endpoints = require('../endpoints.json');
const express = require("express")
const app = express()

app.get('/api', (req, res) => {
    res.status(200).send({ endpoints });
});

module.exports = app
