const express = require("express");
const router = express.Router();
const middleware = require("../middleware");
const controller = require("../controllers/ticket.controller");

router.get("/", controller.getAllTickets);

router.get("/:id", controller.getTicket);

router.post("/", middleware.checkRoleTicketAction, controller.addTicket);

router.put("/:id", middleware.checkRoleTicketAction, controller.updateTicket);

router.delete("/:id", middleware.checkRole(["admin"]), controller.deleteTicket);

module.exports = router;
