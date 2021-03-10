const express = require("express");
const router = express.Router();
const middleware = require("../middleware");
const controller = require("../controllers/ticket.controller");

router.get("/", controller.getAllTickets);

router.get("/:id", controller.getTicket);

router.post("/", middleware.checkRole, controller.addTicket);

router.put("/:id", middleware.checkRole, controller.updateTicket);

router.delete("/:id", controller.deleteTicket);

module.exports = router;
