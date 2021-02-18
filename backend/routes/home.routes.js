var express = require("express");
var router = express.Router();

router.get("/home", function (req, res) {
  res.send("Welcome!");
});

router.get("/secret", function (req, res) {
  res.send("You are now securely logged in..");
});

module.exports = router;
