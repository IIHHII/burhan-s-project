const endpoints = require('../endpoints.json');
const { fetchTopics, fetchArticle, fetchArticles, fetchArticleComments } = require('./model')

exports.apiHealthCheck = (req, res) => {
    res.status(200).send({ endpoints })
}

exports.getTopics = (req, res) => {
    fetchTopics()
        .then((topics) => {
            res.status(200).send({ topics })
        })
        .catch((err) => {
            console.log(err)
        })
}

exports.getArticleById = (req, res, next) => {
    const { article_id } = req.params
    fetchArticle(article_id)
        .then((article) => {
            res.status(200).send({ article })
        })
        .catch(next)
}

exports.getArticles = (req, res, next) => {
    fetchArticles()
    .then((articles) => {
        res.status(200).send({ articles })
    })
    .catch(next)
}

exports.getArticleComments = (req, res, next) => {
    const { article_id } = req.params
    fetchArticleComments(article_id)
    .then((articleComments) => {
        res.status(200).send({ articleComments })
    })
    .catch(next)
}