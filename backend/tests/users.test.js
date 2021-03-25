let chai = require("chai");
let chaiHttp = require("chai-http");
let server = require("../server");
let should = chai.should();

const adminToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImJAYi5jb20iLCJfaWQiOiI2MDNlM2Q4NWYxOTBkMzA0MTQ2YzU5ZWQiLCJpYXQiOjE2MTY2Mjc1ODAsImV4cCI6MTYxNzIzMjM4MH0.kDAn2gCUKIOQxlDbHoHAOHMrPrexFc4EP-jxZ78Fmds";
const clientToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFAYS5jb20iLCJfaWQiOiI2MDNiOTFjMDM4YjkyODEzODRlYjg3MWYiLCJpYXQiOjE2MTY2Mjc2NDQsImV4cCI6MTYxNzIzMjQ0NH0.LQCT4FHwena3gwzypmnk6WHJ6hHG3NC07izyPL6mLc8";
const supportToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImNAYy5jb20iLCJfaWQiOiI2MDNlM2RlZWYxOTBkMzA0MTQ2YzU5ZWUiLCJpYXQiOjE2MTY2Mjc3MDcsImV4cCI6MTYxNzIzMjUwN30._WqjqH3299F_GUDMn9UkPXdfrjolIohzJ8pxApjEaBo";

chai.use(chaiHttp);
// //the parent block
// describe("home root", () => {
//   it("it should return a 200", () => {
//     chai
//       .request(server)
//       .get("/api/home/home")
//       .set("x-access-token", clientToken)
//       .end((err, res) => {
//         res.should.have.status(200);
//       });
//   });
// });

describe("Get All Users Route", () => {
  it("Client should return a 403", () => {
    chai
      .request(server)
      .get("/api/users")
      .set("x-access-token", clientToken)
      .end((err, res) => {
        res.should.have.status(403);
      });
  });

  it("Admin should return a 200", () => {
    chai
      .request(server)
      .get("/api/users")
      .set("x-access-token", adminToken)
      .end((err, res) => {
        res.should.have.status(200);
      });
  });

  it("Support should return a 200", () => {
    chai
      .request(server)
      .get("/api/users")
      .set("x-access-token", supportToken)
      .end((err, res) => {
        res.should.have.status(200);
      });
  });
});
