const express = require("express");
const router = express.Router();

const withAuth = require("../middleware");

router.use("/tickets", withAuth, require("./ticket.routes"));
router.use("/animals", withAuth, require("./animal.routes"));
router.use("/home", require("./home.routes"));

module.exports = router;
