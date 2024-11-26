const db = require("./connection");

function fetchTopics() {
    return db.query(`SELECT * FROM topics`)
        .then(({ rows }) => {
            return rows
        })
}

function fetchArticle(article_id) {
    return db.query(`SELECT * FROM articles WHERE article_id = $1`, [article_id])
        .then(({ rows }) => {
            if(rows.length === 0) {
                return Promise.reject({ status: 404, msg: 'article does not exist' });
            }
            return rows;
        })
}

function fetchArticles() {
    return db.query(`
        SELECT articles.article_id, articles.title, articles.topic, articles.author,
        articles.created_at, articles.votes, articles.article_img_url,
        COUNT(comments.comment_id) AS comment_count
      FROM articles
      LEFT JOIN comments
      ON articles.article_id = comments.article_id
      GROUP BY articles.article_id
      ORDER BY articles.created_at DESC;
      `)
    .then(({ rows }) => {
        return rows
    })
}

module.exports = { fetchTopics, fetchArticle, fetchArticles }