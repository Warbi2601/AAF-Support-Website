const express = require("express");
const router = express.Router();

const withAuth = require("../middleware");
const controller = require("../controllers/auth.controller");

router.post("/register", controller.register);

router.post("/login", controller.login);

router.get("/checkToken", withAuth, controller.checkToken);

router.get("/logout", function (req, res) {
  res.clearCookie("token").redirect("/");
});

module.exports = router;
