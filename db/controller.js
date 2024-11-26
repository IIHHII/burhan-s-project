const endpoints = require('../endpoints.json');
const { fetchTopics, fetchArticle } = require('./model')
const db = require("./connection");

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
        .catch((err) => {
            next(err)
        })
}