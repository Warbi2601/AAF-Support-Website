const express = require("express");
const router = express.Router();
const middleware = require("../middleware");
const controller = require("../controllers/ticket.controller");

const roleNames = {
  client: "client",
  support: "support",
  admin: "admin",
};

router.get("/", controller.getAllTickets);

router.get("/:id", controller.getTicket);

router.post(
  "/",
  middleware.grantAccess("createOwn", "ticket"),
  controller.addTicket
);

// Open Ticket on behalf // Will be POST

router.put("/", controller.updateTicket); //will be removed when all other routes have been implemented

//Client
router.put("/reopen-ticket", controller.updateTicket);
router.put("/add-information", controller.updateTicket);
router.put("/close-ticket", controller.updateTicket);
router.put("/cancel-ticket-user", controller.updateTicket);

//Support
router.put("/allocate-ticket-self", controller.updateTicket);
router.put("/check-ticket", controller.updateTicket);
router.put("/reallocate-ticket", controller.updateTicket);
router.put("/solve-ticket", controller.updateTicket);
router.put("/suspend-ticket", controller.updateTicket);
router.put("/cancel-ticket-support", controller.updateTicket);
router.put("/cancel-abandoned-ticket", controller.updateTicket);

//Admin
router.put(
  "/allocate-ticket-support",
  middleware.checkRole(roleNames.admin),
  controller.updateTicket
);
router.put("/close-ticket-expired", controller.updateTicket);

// router.delete("/", controller.deleteTicket);

module.exports = router;
