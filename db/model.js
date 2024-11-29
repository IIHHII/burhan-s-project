const db = require("./connection");

function fetchTopics() {
    return db.query(`SELECT * FROM topics`)
        .then(({ rows }) => {
            return rows
        })
}

function fetchArticle(article_id) {
    return db.query(`SELECT * FROM articles 
        WHERE article_id = $1`, [article_id])
        .then(({ rows }) => {
            if (rows.length === 0) {
                return Promise.reject({ status: 404, msg: 'article does not exist' });
            }
            return rows;
        })
}

function fetchArticles(sort_by, order) {
    const validSortBys = [
        'article_id',
         'title', 
         'topic', 
         'author', 
         'created_at', 
         'votes', 
         'comment_count'];
  const validOrders = ['asc', 'desc'];

  if (!validSortBys.includes(sort_by) || !validOrders.includes(order)) {
    return Promise.reject({ status: 400, msg: 'Invalid query' });
  }
    return db.query(`
        SELECT articles.article_id, articles.title, articles.topic, articles.author,
        articles.created_at, articles.votes, articles.article_img_url,
        CAST(COUNT(comments.comment_id) AS INT) AS comment_count
      FROM articles
      LEFT JOIN comments
      ON articles.article_id = comments.article_id
      GROUP BY articles.article_id
      ORDER BY ${sort_by} ${order.toUpperCase()};
      `)
        .then(({ rows }) => {
            return rows
        })
}

function fetchArticleComments(article_id) {
    return db.query(`SELECT * FROM comments
         WHERE article_id = $1 
         ORDER BY created_at DESC`, [article_id])
        .then(({ rows }) => {
            if (rows.length === 0) {
                return Promise.reject({ status: 404, msg: 'article does not exist' });
            }
            return rows;
        })
}

function insertComment(article_id, username, body) {
    return db.query(
        `INSERT INTO comments (article_id, author, body) 
        VALUES ($1, $2, $3) RETURNING *;`,
        [article_id, username, body]
    )
        .then(({ rows }) => {
            return rows[0];
        });
}

function updateArticleVotes(article_id, inc_votes) {
    return db.query(
        `UPDATE articles
       SET votes = votes + $1
       WHERE article_id = $2
       RETURNING *;`,
        [inc_votes, article_id]
    )
        .then(({ rows }) => {
            return rows[0];
        });
}

function removeComment(comment_id) {
    return db.query('DELETE FROM comments WHERE comment_id = $1;', [comment_id]);
}

function fetchUsers() {
    return db.query(`SELECT * FROM users`)
        .then(({ rows }) => {
            return rows
        })
}

module.exports = { fetchTopics, fetchArticle, fetchArticles, fetchArticleComments, insertComment, updateArticleVotes, removeComment, fetchUsers }