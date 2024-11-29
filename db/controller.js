const endpoints = require('../endpoints.json');
const { fetchTopics, fetchArticle, fetchArticles, fetchArticleComments, insertComment, updateArticleVotes, removeComment, fetchUsers } = require('./model')

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

exports.postComment = (req, res, next) => {
    const { article_id } = req.params
    const { username, body } = req.body;
    if (!username || !body) {
        return res.status(400).send({ msg: "Bad request" });
    }
    insertComment(article_id, username, body).then((comment) => {
        res.status(201).send({ comment });
    })
        .catch((err) => {
            console.log(err);
            next(err);
        });

}

exports.patchArticle = (req, res, next) => {
    const { article_id } = req.params;
    const { inc_votes } = req.body;

    if (!inc_votes) {
        return res.status(400).send({ msg: 'Bad request' });
    }

    updateArticleVotes(article_id, inc_votes)
        .then((updatedVotes) => {
            if (!updatedVotes) {
                return res.status(400).send({ msg: "Bad request" });
            }
            res.status(200).send({ article: updatedVotes });
        })
}

exports.deleteComment = (req, res, next) => {
    const { comment_id } = req.params;
    removeComment(comment_id)
        .then((result) => {
            if (result.rowCount === 0) {
                return res.status(404).send({ msg: 'Comment not found' });
            }
            res.status(204).send();
        });
}

exports.getUsers = (req, res, next) => {
    fetchUsers()
    .then((users) => {
        res.status(200).send({ users })
    })
    .catch(next)
}