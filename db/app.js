const express = require("express")
const app = express()
app.use(express.json());
const {
    apiHealthCheck,
    getTopics,
    getArticleById, 
    getArticles } = require("./controller")
app.get('/api', apiHealthCheck)

app.get('/api/topics', getTopics)

app.get('/api/articles/:article_id', getArticleById)

app.get('/api/articles', getArticles)

app.use((err, req, res, next) => {
    if (err.status) {
        res.status(err.status).send({ msg: err.msg })
    } else {
        res.status(500).send({ msg: 'Internal Server Error' });
    }
})

app.use((req, res, next) => {
    res.status(404).send({ msg: 'Route not found' });
  });
  

module.exports = app
