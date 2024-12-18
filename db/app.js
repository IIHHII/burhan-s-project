const cors = require('cors');
const express = require("express")
const app = express()
app.use(cors());
app.use(express.json());
const {
    apiHealthCheck,
    getTopics,
    getArticleById,
    getArticles,
    getArticleComments,
    postComment, 
    patchArticle,
    deleteComment,
    getUsers } = require("./controller")
app.get('/api', apiHealthCheck)

app.get('/api/topics', getTopics)

app.get('/api/articles/:article_id', getArticleById)

app.get('/api/articles', getArticles)

app.get('/api/articles/:article_id/comments', getArticleComments)

app.post('/api/articles/:article_id/comments', postComment)

app.patch('/api/articles/:article_id', patchArticle)

app.delete('/api/comments/:comment_id', deleteComment);

app.get('/api/users', getUsers)

app.all('*', (req, res, next) => {
    res.status(404).send({ msg: 'Route not found' });
});

app.use((err, req, res, next) => {
    if (err.status) {
        res.status(err.status).send({ msg: err.msg })
    } else {
        res.status(500).send({ msg: 'Internal Server Error' });
    }
})

module.exports = app
