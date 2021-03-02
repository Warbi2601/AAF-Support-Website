const express = require("express");
const router = express.Router();

const controller = require("../controllers/user.controller");

router.get("/", controller.getAllUsers);

router.get("/:id", controller.getUser);

// router.post("/", controller.addTicket);

// router.put("/", controller.updateTicket);

// router.delete("/", controller.deleteTicket);
// when deleting user - all tickets deleted, or tell the deleter that the tickets will all be set to cancelled or something

module.exports = router;
