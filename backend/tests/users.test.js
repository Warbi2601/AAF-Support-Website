let chai = require("chai");
let chaiHttp = require("chai-http");
let server = require("../server");
let should = chai.should();

const adminToken = process.env.ADMIN_TOKEN;
const clientToken = process.env.CLIENT_TOKEN;
const supportToken = process.env.SUPPORT_TOKEN;

const adminID = process.env.ADMIN_ID;
const clientID = process.env.CLIENT_ID;
const supportID = process.env.SUPPORT_ID;

const endpoint = "/api/users";

const testUserID = "605c8e2d57301d730cbaa8cb"; // this will need updating as it gets deleted

chai.use(chaiHttp);
let currentResponse = null; // for console logging responses when debugging

describe("Users", () => {
  afterEach(function () {
    // for console logging responses when debugging
    const body = currentResponse?.body;
    console.log("Request Body", body);
    currentResponse = null;
  });
  describe("GET/all", () => {
    // Test to get all users
    it("Client should return a 403", (done) => {
      chai
        .request(server)
        .get(endpoint)
        .set("x-access-token", clientToken)
        .end((err, res) => {
          currentResponse = res;
          res.should.have.status(403);
          done();
        });
    });

    it("Admin should return an array of users", (done) => {
      chai
        .request(server)
        .get(endpoint)
        .set("x-access-token", adminToken)
        .end((err, res) => {
          currentResponse = res;
          res.should.have.status(200);
          res.body.should.be.a("array");
          done();
        });
    });

    it("Support should return an array of users", (done) => {
      chai
        .request(server)
        .get(endpoint)
        .set("x-access-token", supportToken)
        .end((err, res) => {
          currentResponse = res;
          res.should.have.status(200);
          res.body.should.be.a("array");
          done();
        });
    });
  });

  // ------------------------

  describe("GET/one", () => {
    it("Client getting another user should return a 403", (done) => {
      chai
        .request(server)
        .get(`${endpoint}/${supportID}`)
        .set("x-access-token", clientToken)
        .end((err, res) => {
          currentResponse = res;
          res.should.have.status(403);
          done();
        });
    });

    it("Client getting themselves should return a 200", (done) => {
      chai
        .request(server)
        .get(`${endpoint}/${clientID}`)
        .set("x-access-token", clientToken)
        .end((err, res) => {
          currentResponse = res;
          res.should.have.status(200);
          done();
        });
    });

    it("Admin getting another user should return a user object no password 200", (done) => {
      chai
        .request(server)
        .get(`${endpoint}/${clientID}`)
        .set("x-access-token", adminToken)
        .end((err, res) => {
          currentResponse = res;
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.should.have.property("_id");
          res.body.should.have.property("role");
          res.body.should.have.property("email");
          res.body.should.have.property("firstName");
          res.body.should.have.property("lastName");
          res.body.should.not.have.property("password");
          done();
        });
    });

    it("Support getting another user should return a user object no password 200", (done) => {
      chai
        .request(server)
        .get(`${endpoint}/${clientID}`)
        .set("x-access-token", supportToken)
        .end((err, res) => {
          currentResponse = res;
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.should.have.property("_id");
          res.body.should.have.property("role");
          res.body.should.have.property("email");
          res.body.should.have.property("firstName");
          res.body.should.have.property("lastName");
          res.body.should.not.have.property("password");
          done();
        });
    });

    it("Any user getting another user that doesn't exist returns 404", (done) => {
      chai
        .request(server)
        .get(`${endpoint}/605ba67458deb587e46da0e9`)
        .set("x-access-token", supportToken)
        .end((err, res) => {
          currentResponse = res;
          res.should.have.status(404);
          done();
        });
    });
  });

  describe("POST/", () => {
    it("Creating a valid new user returns 200 and user object - WARNING: User will need to be deleted after otherwise next time it will throw a duplicate email error", (done) => {
      let newUser = {
        email: "aaa@aaa.com",
        password: "qwerty",
        firstName: "aaa",
        lastName: "aaa",
        role: "client",
      };
      chai
        .request(server)
        .post("/auth/register")
        .send(newUser)
        .end((err, res) => {
          currentResponse = res;
          res.should.have.status(200);
          res.body.user.should.be.a("object");
          res.body.user.should.have.property("_id");
          res.body.user.should.have.property("role");
          res.body.user.should.have.property("email");
          res.body.user.should.have.property("firstName");
          res.body.user.should.have.property("lastName");
          res.body.user.should.not.have.property("password");
          res.body.should.have
            .property("success")
            .eql("Registered Successfully");
          done();
        });
    });

    it("Creating a new user with invalid data returns 400", (done) => {
      let newUser = {
        email: "testemail@new.com",
        password: "",
        firstName: "",
        lastName: "",
        role: "",
      };
      chai
        .request(server)
        .post("/auth/register")
        .send(newUser)
        .end((err, res) => {
          currentResponse = res;
          res.should.have.status(500);
          res.body.should.have
            .property("error")
            .eql("Error registering your account, try again.");
          done();
        });
    });

    it("Logging in with incorrect details returns 400", (done) => {
      let credentials = {
        email: "abcdef@ghijk.com",
        password: "iqjsqhs",
      };
      chai
        .request(server)
        .post("/auth/login")
        .send(credentials)
        .end((err, res) => {
          currentResponse = res;
          res.should.have.status(401);
          res.body.should.have
            .property("error")
            .eql("Incorrect email or password");
          done();
        });
    });

    it("Logging in with correct details from earlier returns 200 and user object", (done) => {
      let credentials = {
        email: "aaa@aaa.com",
        password: "qwerty",
      };
      chai
        .request(server)
        .post("/auth/login")
        .send(credentials)
        .end((err, res) => {
          currentResponse = res;
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.should.have.property("_id");
          res.body.should.have.property("role");
          res.body.should.have.property("email");
          res.body.should.have.property("firstName");
          res.body.should.have.property("lastName");
          res.body.should.not.have.property("password");
          done();
        });
    });
  });

  describe("PUT/", () => {
    it("Client update valid user return 403", (done) => {
      let newUserDetails = {
        password: "qqqq",
        role: "admin",
      };
      chai
        .request(server)
        .put(`${endpoint}/${testUserID}`)
        .send(newUserDetails)
        .set("x-access-token", clientToken)
        .end((err, res) => {
          currentResponse = res;
          res.should.have.status(403);
          done();
        });
    });

    it("Support update valid user return 403", (done) => {
      let newUserDetails = {
        password: "qqqq",
        role: "admin",
      };
      chai
        .request(server)
        .put(`${endpoint}/${testUserID}`)
        .send(newUserDetails)
        .set("x-access-token", supportToken)
        .end((err, res) => {
          currentResponse = res;
          res.should.have.status(403);
          done();
        });
    });

    it("Admin update valid user return 200", (done) => {
      let newUserDetails = {
        password: "puttest",
        role: "admin",
      };
      chai
        .request(server)
        .put(`${endpoint}/${testUserID}`)
        .send(newUserDetails)
        .set("x-access-token", adminToken)
        .end((err, res) => {
          currentResponse = res;
          res.should.have.status(200);
          done();
        });
    });
  });

  describe("DELETE/", () => {
    it("Client delete valid user return 403", (done) => {
      chai
        .request(server)
        .delete(`${endpoint}/${testUserID}`)
        .set("x-access-token", clientToken)
        .end((err, res) => {
          currentResponse = res;
          res.should.have.status(403);
          done();
        });
    });

    it("Support delete valid user return 403", (done) => {
      chai
        .request(server)
        .delete(`${endpoint}/${testUserID}`)
        .set("x-access-token", supportToken)
        .end((err, res) => {
          currentResponse = res;
          res.should.have.status(403);
          done();
        });
    });

    it("Admin delete valid user return 200", (done) => {
      chai
        .request(server)
        .delete(`${endpoint}/${testUserID}`)
        .set("x-access-token", adminToken)
        .end((err, res) => {
          currentResponse = res;
          res.should.have.status(200);
          done();
        });
    });
  });
});
