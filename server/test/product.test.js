let mongoose = require("mongoose");
let Product = require("../models/product.model");

let chai = require("chai");
let chaiHttp = require("chai-http");
let server = require("../app");
let should = chai.should();

chai.use(chaiHttp);

describe("Products", () => {
  beforeEach(done => {
    //Before each test we empty the database
    Product.remove({}, err => {
      done();
    });
  });
  describe("/GET product", () => {
    it("it should GET all the product", done => {
      chai
        .request(server)
        .get("/products")
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("array");
          done();
        });
    });
  });
  describe("/POST Product", () => {
    it("it should not POST a Product without quantity field", done => {
      let product = {
        name: "Apple",
        unitType: "bitcoin"
      };
      chai
        .request(server)
        .post("/products/create")
        .send(product)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a("object");
          res.body.should.have.property("errors");
          res.body.errors.should.have.property("quantity");
          res.body.errors.quantity.should.have.property("kind").eql("required");
          done();
        });
    });
    it("it should POST a product ", done => {
      let product = {
        name: "Apple",
        quantity: "12",
        unitType: "bitcoin"
      };
      chai
        .request(server)
        .post("/products/create")
        .send(product)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.should.have
            .property("message")
            .eql("Product Created successfully!");
          res.body.product.should.have.property("name");
          res.body.product.should.have.property("quantity");
          res.body.product.should.have.property("unitType");
          done();
        });
    });
  });
  describe("/GET/:id product", () => {
    it("it should GET a product by the given id", done => {
      let product = new Product({
        name: "Apple",
        quantity: "12",
        unitType: "bitcoin"
      });
      product.save((err, product) => {
        chai
          .request(server)
          .get("/products/" + product.id)
          .send(product)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a("object");
            res.body.should.have.property("name");
            res.body.should.have.property("quantity");
            res.body.should.have.property("unitType");
            res.body.should.have.property("_id").eql(product.id);
            done();
          });
      });
    });
  });
  describe("/PUT/:id product", () => {
    it("it should UPDATE a product given the id", done => {
      let product = new Product({
        name: "Apple",
        quantity: "12",
        unitType: "bitcoin"
      });
      product.save((err, product) => {
        chai
          .request(server)
          .put("/products/" + product.id + "/update")
          .send({
            name: "Apple",
            quantity: "15",
            unitType: "bitcoin"
          })
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a("object");
            res.body.should.have
              .property("message")
              .eql("Product Udpated successfully!");
            done();
          });
      });
    });
  });
  /*
  * Test the /DELETE/:id route
  */
  describe("/DELETE/:id product", () => {
    it("it should DELETE a product given the id", done => {
      let product = new Product({
        name: "Apple",
        quantity: "15",
        unitType: "bitcoin"
      });
      product.save((err, product) => {
        chai
          .request(server)
          .delete("/products/" + product.id + "/delete")
          .end((err, res) => {
            res.body.should.be.a("object");
            res.body.should.have
              .property("message")
              .eql("Product Deleted successfully!");
            done();
          });
      });
    });
  });
});
