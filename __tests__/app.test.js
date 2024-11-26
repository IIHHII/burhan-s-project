const endpointsJson = require("../endpoints.json");
const request = require("supertest")
const app = require("../db/app")
const db = require("../db/connection")
const seed = require("../db/seeds/seed")
const data = require("../db/data/test-data/index")


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
});

// test('should return 500 with generic error message when an unexpected error occurs', () => {
//   app.get('/error-test', (req, res, next) => {
//     next(new Error('Unexpected error!'));
//     console.log('1')
//   });
//   return request(app)
//     .get('/error-test')
//     .expect(500)
//     .then(({ body }) => {
//       expect(body.msg).toBe('Internal Server Error');
//     });
// });
