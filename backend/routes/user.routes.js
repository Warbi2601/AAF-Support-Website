const express = require("express");
const router = express.Router();

const controller = require("../controllers/user.controller");

router.get("/", controller.getAllUsers);

router.get("/:id", controller.getUser);

// router.post("/", controller.addTicket); -- this is in auth

router.put("/:id", controller.updateUser);

router.delete("/:id", controller.deleteUser);

module.exports = router;
