const express = require("express")
const app = express()
app.use(express.json());
const {
    apiHealthCheck,
    getTopics,
    getArticleById } = require("./controller")
app.get('/api', apiHealthCheck)

app.get('/api/topics', getTopics)

app.get('/api/articles/:article_id', getArticleById)

app.use((err, req, res, next) => {
    console.log(err.msg)
    if (err.status) {
        res.status(err.status).send({ msg: err.msg })
    } else {
        res.status(500).send({ msg: 'Internal Server Error' });
    }
})

module.exports = app
