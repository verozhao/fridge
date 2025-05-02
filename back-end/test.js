const assert = require("assert")
const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('./app');

chai.use(chaiHttp);
const expect = chai.expect;

// Test that hits the root / endpoint and checks the response
describe("Root API", () => {
  it("should return the welcome message", (done) => {
    chai.request(app)
      .get("/")
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.text).to.equal("Smart Refrigerator Management System API");
        done();
      });
  });
});


// inventory API tests
describe("Inventory API", function() {
  // Test getting all items
  describe("GET /api/items", function() {
    it("should get all inventory items", function(done) {
      chai.request(app)
        .get('/api/items')
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('status').eql('success');
          expect(res.body).to.have.property('data').to.be.an('array');
          done();
        });
    });
  });

// inventory API tests: test getting item by ID
describe("GET /api/items/:id", function() {
  it("should get an item by id", function(done) {
    chai.request(app)
      .get('/api/items/1')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('status').eql('success');
        expect(res.body).to.have.property('data').to.be.an('object');
        expect(res.body.data).to.have.property('id').eql('1');
        done();
      });
  });

  it("should return 404 for non-existent item", function(done) {
    chai.request(app)
      .get('/api/items/999')
      .end((err, res) => {
        expect(res).to.have.status(404);
        expect(res.body).to.have.property('status').eql('error');
        expect(res.body).to.have.property('message').eql('Item not found');
        done();
      });
  });
});

// inventory API tests: test creating new item
describe("POST /api/items", function() {
  it("should create a new item", function(done) {
    const newItem = {
      name: 'Yogurt',
      category: 'Dairy',
      expirationDate: '2025-04-20',
      quantity: '6 pack',
      storageLocation: 'Main shelf'
    };

    chai.request(app)
      .post('/api/items')
      .send(newItem)
      .end((err, res) => {
        expect(res).to.have.status(201);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('status').eql('success');
        expect(res.body).to.have.property('message').eql('Item added successfully');
        expect(res.body).to.have.property('data').to.be.an('object');
        expect(res.body.data).to.have.property('name').eql('Yogurt');
        done();
      });
  });
});

// inventory API tests: test filtering items by category
describe("GET /api/items/category/:category", function() {
  it("should get items by category", function(done) {
    chai.request(app)
      .get('/api/items/category/dairy')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('status').eql('success');
        expect(res.body).to.have.property('data').to.be.an('array');
        if (res.body.data.length > 0) {
          res.body.data.forEach(item => {
            expect(item.category.toLowerCase()).to.equal('dairy');
          });
        }
        done();
      });
  });
});
});

//Account setting API test 
describe("Account-setting API", function(){
  describe("GET /api/Account-Setting/:field/", function() {
    it("should get updated username", function(done){ 
      chai.request(app)
      .get('/api/Account-Setting/name')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('name');
        //expect to match database --> next sprint
        done();
      });
    })

    it("should get updated email", function(done){ 
      chai.request(app)
      .get('/api/Account-Setting/email')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('email');
        //expect to match database --> next sprint
        done();
      });
    })

    it("should get updated phone", function(done){ 
      chai.request(app)
      .get('/api/Account-Setting/phone')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('phone');
        //expect to match database --> next sprint
        done();
      });
    })
  })

  describe("POST /api/Account-Setting/:field/", function(){
    it("should update user's name", function(done){
      chai.request(app)
      .post("/api/Account-Setting/name")
      .send({value : "John Doe"})
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('name');
        expect(res.body.name).to.equal('John Doe');
        done();
      })
    })
  })

})

// Auth API tests
describe("Authorization API (Login, Signup, Logout)", function () {

  // Login Tests 

  // POST /api/login
  describe("POST /api/login", () => {
    it("should login successfully with valid credentials", (done) => {
      chai.request(app)
        .post("/api/login")
        .send({ email: "john@example.com", password: "12345" })
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.have.property("message", "Login successful");
          expect(res.body).to.have.property("user");
          expect(res.body.user).to.have.property("email", "john@example.com");
          done();
        });
    });

    it("should fail login with invalid credentials", (done) => {
      chai.request(app)
        .post("/api/login")
        .send({ email: "wrong@example.com", password: "wrongpass" })
        .end((err, res) => {
          expect(res).to.have.status(401);
          expect(res.body).to.have.property("error", "Invalid credentials");
          done();
        });
    });

    it("should fail login if email or password is missing", function (done) {
      chai.request(app)
        .post("/api/login")
        .send({ email: "" }) // missing password
        .end((err, res) => {
          expect(res).to.have.status(401);
          expect(res.body).to.have.property("error");
          done();
        });
    });
  });

  // Signup Tests 

  // POST /api/signup
  describe("POST /api/signup", () => {
    it("should signup successfully with valid data", (done) => {
      chai.request(app)
        .post("/api/signup")
        .send({
          email: "newuser@example.com",
          password: "securepassword",
          name: "New User"
        })
        .end((err, res) => {
          expect(res).to.have.status(201);
          expect(res.body).to.have.property("message", "Signup successful");
          expect(res.body).to.have.property("user");
          expect(res.body.user).to.have.property("email", "newuser@example.com");
          expect(res.body.user).to.have.property("name", "New User");
          done();
        });
    });

    it("should fail if required fields are missing", (done) => {
      chai.request(app)
        .post("/api/signup")
        .send({ email: "incomplete@example.com" }) // missing name and password
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body).to.have.property("error");
          done();
        });
    });

    it("should fail to signup if email is already registered", (done) => {
      const userData = {
        email: "duplicate@example.com",
        password: "mypassword",
        name: "Duplicate User"
      };

      // First signup should succeed
      chai.request(app)
        .post("/api/signup")
        .send(userData)
        .end((err, res) => {
          expect(res).to.have.status(201);
          expect(res.body).to.have.property("message", "Signup successful");

          // Second signup with same email should fail
          chai.request(app)
            .post("/api/signup")
            .send(userData)
            .end((err2, res2) => {
              expect(res2).to.have.status(409);
              expect(res2.body).to.have.property("error", "Email already registered");
              done();
            });
        });
    });
  });

  // Logout Tests

  // POST /api/logout
  describe("POST /api/logout", () => {
    it("should logout successfully and return status 200", (done) => {
      chai.request(app)
        .post('/api/logout')
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('message').eql('Logout successful');
          done();
        });
    });
  });

});


describe("Analytics API", () => {
    it("should return analytics summary", (done) => {
        chai.request(app)
            .get("/api/analytics")
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.have.property("totalItems");
                expect(res.body).to.have.property("expiringSoon");
                expect(res.body).to.have.property("expired");
                expect(res.body).to.have.property("byCompartment");
                done();
            });
    });
});

describe("Waste Pattern API", () => {
    it("should return waste breakdown for a valid date range", (done) => {
        chai.request(app)
            .get("/api/waste")
            .query({ startDate: "2025-04-01", endDate: "2025-04-15" })
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.have.property("totalExpired");
                expect(res.body).to.have.property("breakdown").that.is.an("object");
                done();
            });
    });

    it("should return empty data when no dates are provided", (done) => {
        chai.request(app)
            .get("/api/waste")
            .end((err, res) => {
                expect(res).to.have.status(200);
                done();
            });
    });
});
describe("Recommendations API", () => {
    it("should return mustBuy and replenish arrays", (done) => {
        chai.request(app)
            .get("/api/recommendations?daysAhead=7")
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.have.property("mustBuy").that.is.an("array");
                expect(res.body).to.have.property("replenish").that.is.an("array");
                done();
            });
    });
});