const express = require("express");
const router = express.Router();

const controller = require("../controllers/user.controller");

router.get("/", controller.getAllUsers);

router.get("/:id", controller.getUser);

// router.post("/", controller.addTicket);

// router.put("/", controller.updateTicket);

// router.delete("/", controller.deleteTicket);

module.exports = router;
