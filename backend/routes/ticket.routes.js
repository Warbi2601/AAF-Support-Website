const express = require("express");
const router = express.Router();
const middleware = require("../middleware");
const controller = require("../controllers/ticket.controller");
const logic = require("../logic/ticket.logic");

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

router.put("/:id", middleware.checkRole, controller.updateTicket); //will be removed when all other routes have been implemented

// router.delete("/", controller.deleteTicket);

// //Client
// router.put("/reopen-ticket", controller.updateTicket);
// router.put("/add-information", controller.updateTicket);
// router.put("/close-ticket", controller.updateTicket);
// router.put("/cancel-ticket-user", controller.updateTicket);

// //Support
// router.put(
//   "/allocate-ticket-self",
//   middleware.checkRole(),

//   controller.updateTicket
// );

// router.put(
//   "/check-ticket",
//   middleware.checkRole(roleNames.support),
//   controller.updateTicket
// );

// router.put(
//   "/reallocate-ticket",
//   middleware.checkRole(roleNames.support),
//   controller.updateTicket
// );

// router.put(
//   "/solve-ticket",
//   middleware.checkRole(roleNames.support),
//   controller.updateTicket
// );

// router.put(
//   "/suspend-ticket",
//   middleware.checkRole(roleNames.support),
//   controller.updateTicket
// );

// router.put(
//   "/cancel-ticket-support",
//   middleware.checkRole(roleNames.support),
//   controller.updateTicket
// );

// router.put(
//   "/cancel-abandoned-ticket",
//   middleware.checkRole(roleNames.support),
//   controller.updateTicket
// );

// //Admin
// router.put(
//   "/allocate-ticket-support",
//   middleware.checkRole(roleNames.admin),
//   controller.updateTicket
// );
// router.put(
//   "/close-ticket-expired",
//   middleware.checkRole(roleNames.admin),
//   controller.updateTicket
// );

module.exports = router;
