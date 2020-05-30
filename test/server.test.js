process.env.NODE_ENV = 'test';

const assert = require("assert");
const expect = require("chai").expect;
const request = require("supertest");
const app = require("../server");
const mongoose = require('mongoose');


describe("Server Testing Example", () => {

  beforeEach(function (done) {
    mongoose.connection.dropDatabase(function() {
      done()
    })
  })

  it("posting returns 200", () => {
    return request(app)
      .post("/scores")
      .send({ name: "Tom", score: 200})
      .then((response) => {
        assert.equal(response.status, 200);
        expect(response.body.name).to.equal("Tom");
      });
  });

  it("GET /scores return scores in descending order", async () => {
    const first = await request(app)
    .post("/scores")
    .send({ name: "Nigel", score: 100})

    const second = await request(app)
    .post("/scores")
    .send({ name: "Colin", score: 80})

    const third = await request(app)
    .post("/scores")
    .send({ name: "Derek", score: 90})
    
    await Promise.all([first, second, third])
    .then(() => {
      return request(app)
      .get("/scores")
      .then((response) => {
        expect(response.body[0].score).to.equal(100);
        expect(response.body[1].score).to.equal(90);
        expect(response.body[2].score).to.equal(80);
      })   
    })
  });
});
