let chai = require("chai");
let chaiHttp = require("chai-http");
let server = require("../server");
let should = chai.should();

const adminToken = process.env.ADMIN_TOKEN;
const clientToken = process.env.CLIENT_TOKEN;
const supportToken = process.env.SUPPORT_TOKEN;

const endpoint = "/api/tickets";

const testTicketID = "605c89d17d4f1777f4b1dcb9";

chai.use(chaiHttp);
let currentResponse = null; // for console logging responses when debugging

describe("Tickets", () => {
  afterEach(function () {
    // for console logging responses when debugging
    const body = currentResponse?.body;
    console.log("Request Body", body);
    currentResponse = null;
  });
  describe("GET/all", () => {
    // Test to get all tickets
    it("Client should return a 200 array of only their tickets", (done) => {
      chai
        .request(server)
        .get(endpoint)
        .set("x-access-token", clientToken)
        .end((err, res) => {
          currentResponse = res;
          res.should.have.status(200);
          res.body.should.be.a("array");
          //check only their tickets here
          done();
        });
    });

    it("Admin should return a 200 array of tickets", (done) => {
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

    it("Support should return a 200 array of tickets", (done) => {
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

  describe("POST/", () => {
    it("Client create valid ticket return 200", (done) => {
      let newTicket = {
        ticket: {
          issue: "Test Issue",
          department: "Test Department",
        },
        action: 1,
      };
      chai
        .request(server)
        .post(endpoint)
        .send(newTicket)
        .set("x-access-token", clientToken)
        .end((err, res) => {
          currentResponse = res;
          res.should.have.status(200);
          //   res.body.should.be.a("array");
          done();
        });
    });

    it("Client create invalid ticket return 400", (done) => {
      let newTicket = {
        ticket: {
          issue: "",
          department: "",
        },
        action: 1,
      };

      chai
        .request(server)
        .post(endpoint)
        .send(newTicket)
        .set("x-access-token", clientToken)
        .end((err, res) => {
          currentResponse = res;
          res.should.have.status(500);
          res.body.should.have
            .property("error")
            .eql("Error logging your ticket, try again.");
          done();
        });
    });
  });

  describe("DELETE/", () => {
    it("Client delete valid ticket return 403", (done) => {
      chai
        .request(server)
        .delete(`${endpoint}/${testTicketID}`)
        .set("x-access-token", clientToken)
        .end((err, res) => {
          currentResponse = res;
          res.should.have.status(403);
          done();
        });
    });

    it("Support delete valid ticket return 403", (done) => {
      chai
        .request(server)
        .delete(`${endpoint}/${testTicketID}`)
        .set("x-access-token", supportToken)
        .end((err, res) => {
          currentResponse = res;
          res.should.have.status(403);
          done();
        });
    });

    // it("Admin delete valid ticket return 200", (done) => {
    //   chai
    //     .request(server)
    //     .delete(`${endpoint}/${testTicketID}`)
    //     .set("x-access-token", adminToken)
    //     .end((err, res) => {
    //       currentResponse = res;
    //       res.should.have.status(200);
    //       done();
    //     });
    // });
  });
});

// ------------------------

//   describe("GET/one", () => {
//     it("Client getting another user should return a 403", (done) => {
//       chai
//         .request(server)
//         .get("/api/users/" + supportID)
//         .set("x-access-token", clientToken)
//         .end((err, res) => {
//           currentResponse = res;
//           res.should.have.status(403);
//           done();
//         });
//     });

//     it("Client getting themselves should return a 200", (done) => {
//       chai
//         .request(server)
//         .get("/api/users/" + clientID)
//         .set("x-access-token", clientToken)
//         .end((err, res) => {
//           currentResponse = res;
//           res.should.have.status(200);
//           done();
//         });
//     });

//     it("Admin getting another user should return a user object no password 200", (done) => {
//       chai
//         .request(server)
//         .get("/api/users/" + clientID)
//         .set("x-access-token", adminToken)
//         .end((err, res) => {
//           currentResponse = res;
//           res.should.have.status(200);
//           res.body.should.be.a("object");
//           res.body.should.have.property("_id");
//           res.body.should.have.property("role");
//           res.body.should.have.property("email");
//           res.body.should.have.property("firstName");
//           res.body.should.have.property("lastName");
//           res.body.should.not.have.property("password");
//           done();
//         });
//     });

//     it("Support getting another user should return a user object no password 200", (done) => {
//       chai
//         .request(server)
//         .get("/api/users/" + clientID)
//         .set("x-access-token", supportToken)
//         .end((err, res) => {
//           currentResponse = res;
//           res.should.have.status(200);
//           res.body.should.be.a("object");
//           res.body.should.have.property("_id");
//           res.body.should.have.property("role");
//           res.body.should.have.property("email");
//           res.body.should.have.property("firstName");
//           res.body.should.have.property("lastName");
//           res.body.should.not.have.property("password");
//           done();
//         });
//     });

//     it("Any user getting another user that doesn't exist returns 404", (done) => {
//       chai
//         .request(server)
//         .get("/api/users/605ba67458deb587e46da0e9")
//         .set("x-access-token", supportToken)
//         .end((err, res) => {
//           currentResponse = res;
//           res.should.have.status(404);
//           done();
//         });
//     });
//   });
