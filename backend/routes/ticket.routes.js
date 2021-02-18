const express = require("express");
const router = express.Router();

const controller = require("../controllers/ticket.controller");

router.get("/", controller.getAllTickets);

router.get("/:id", controller.getTicket);

router.post("/", controller.addTicket);

// router.put("/", controller.updateTicket);

// router.delete("/", controller.deleteTicket);

module.exports = router;
