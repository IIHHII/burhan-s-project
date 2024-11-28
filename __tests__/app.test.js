const endpointsJson = require("../endpoints.json");
const request = require("supertest")
const app = require("../db/app")
const db = require("../db/connection")
const seed = require("../db/seeds/seed")
const data = require("../db/data/test-data/index")
require("jest-sorted");


afterAll(() => {
  return db.end()
})

beforeEach(() => {
  return seed(data)
})

describe("GET /api", () => {
  test("200: Responds with an object detailing the documentation for each endpoint", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body: { endpoints } }) => {
        expect(endpoints).toEqual(endpointsJson);
      });
  });
});

describe("GET /api/topics", () => {
  test("200: Responds with an object of all the topics", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        expect(body.topics).toHaveLength(3);
        body.topics.forEach(({ description, slug }) => {
          expect(typeof description).toBe("string");
          expect(typeof slug).toBe("string")
        })
      });
  });
})

describe("GET /api/articles/:article_id", () => {
  test("200: Responds with an object of the article with the correct article id", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body }) => {
        expect(body.article).toHaveLength(1);
        body.article.forEach(({ article_id, title, topic, author, body, created_at, votes, article_img_url }) => {
          expect(typeof article_id).toBe("number")
          expect(typeof title).toBe("string")
          expect(typeof topic).toBe("string")
          expect(typeof author).toBe("string")
          expect(typeof body).toBe("string")
          expect(typeof created_at).toBe("string")
          expect(typeof votes).toBe("number")
          expect(typeof article_img_url).toBe("string")
        })
      });
  });
  test('GET:404 sends an appropriate status and error meaasge when given a valid bot non-existent id', () => {
    return request(app)
      .get('/api/articles/123')
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe('article does not exist');
      })
  })
  test('404: Responds with an error when the route is invalid', () => {
    return request(app)
      .get('/api/invalid-route')
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe('Route not found');
      });
  });
});

describe("GET /api/articles", () => {
  test("200: Responds with an object of all the articles", () => {
    return request(app)
      .get('/api/articles')
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toHaveLength(13);
        body.articles.forEach(({ article_id, title, topic, author, created_at, votes, article_img_url, comment_count }) => {
          expect(typeof article_id).toBe("number")
          expect(typeof title).toBe("string")
          expect(typeof topic).toBe("string")
          expect(typeof author).toBe("string")
          expect(typeof created_at).toBe("string")
          expect(typeof votes).toBe("number")
          expect(typeof article_img_url).toBe("string")
          expect(typeof comment_count).toBe("number")
        })
        expect(body.articles).toBeSortedBy('created_at', { descending: true });
      })
  })
  test('404: Responds with an error when the route is invalid', () => {
    return request(app)
      .get('/api/invalid-route')
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe('Route not found');
      });
  });
})

describe("GET /api/articles/:article_id/comments", () => {
  test("200: responds with object of all comments in order from the correct article", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body }) => {
        expect(body.articleComments).toHaveLength(11);
        body.articleComments.forEach(({ comment_id, body, votes, author, article_id, created_at }) => {
          expect(typeof comment_id).toBe("number")
          expect(typeof body).toBe("string")
          expect(typeof votes).toBe("number")
          expect(typeof author).toBe("string")
          expect(article_id).toBe(1)
          expect(typeof created_at).toBe("string")
        })
        expect(body.articleComments).toBeSortedBy('created_at', { descending: true });
      });
  });
  // test("200: responds with object ", () => {
  //   return request(app)
  //     .get("/api/articles/1/comments")
  //     .expect(200)
  //     .then(({ body }) => {
        
  //     });
  // });
  test('404: sends an appropriate status and error meaasge when given a valid bot non-existent id', () => {
    return request(app)
      .get('/api/articles/123/comments')
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe('article does not exist');
      })
  })
  test('404: Responds with an error when the route is invalid', () => {
    return request(app)
      .get('/api/invalid-route')
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe('Route not found');
      });
  });
});

describe("POST /api/articles/:article_id/comments", () => {
  test("201: inserts a comment to the db and sends the new comment back to the client", () => {
    const newComment = {
      username: "butter_bridge",
      body: "This is a test comment",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(201)
      .then(({ body }) => {
        console.log(body)
        expect(body.comment.author).toBe("butter_bridge");
        expect(body.comment.body).toBe("This is a test comment");
        expect(body.comment.article_id).toBe(1);
      });
  });
  test("400 responds with an appropriate status and error message when provided with a bad comment (no username)", () => {
    return request(app)
      .post('/api/articles/1/comments')
      .send({
        body: "This is a test comment"
      })
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe('Bad request');
      });
  });
});

describe('PATCH /api/articles/:article_id', () => {
  test('200: responds with the updated article when votes are incremented', () => {
    return request(app)
      .patch('/api/articles/1')
      .send({ inc_votes: 1 })
      .expect(200)
      .then(({ body }) => {
        expect(body.article).toMatchObject({
          article_id: 1,
          votes: expect.any(Number),
        });
        expect(body.article.votes).toBe(101);
      });
  });

  test('200: responds with the updated article when votes are decremented', () => {
    return request(app)
      .patch('/api/articles/1')
      .send({ inc_votes: -1000 })
      .expect(200)
      .then(({ body }) => {
        expect(body.article).toMatchObject({
          article_id: 1,
          votes: expect.any(Number),
        });
        expect(body.article.votes).toBe(-900);
      });
  });

  test('400: responds with bad request when inc_votes is missing', () => {
    return request(app)
      .patch('/api/articles/1')
      .send({})
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('Bad request');
      });
  });
});


