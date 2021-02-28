const express = require("express");
const router = express.Router();
const middleware = require("../middleware");
const controller = require("../controllers/ticket.controller");

router.get("/", controller.getAllTickets);

router.get("/:id", controller.getTicket);

router.post(
  "/",
  middleware.grantAccess("createOwn", "ticket"),
  controller.addTicket
);

// router.put("/", controller.updateTicket);

// router.delete("/", controller.deleteTicket);

module.exports = router;
