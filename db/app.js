const express = require("express")
const app = express()
const { apiHealthCheck , getTopics } = require("./controller")

app.get('/api', apiHealthCheck)

app.get('/api/topics', getTopics)

module.exports = app
