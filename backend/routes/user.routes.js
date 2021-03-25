const express = require("express");
const router = express.Router();

const controller = require("../controllers/user.controller");
const middleware = require("../middleware");

router.get(
  "/",
  middleware.checkRole(["admin", "support"]),
  controller.getAllUsers
);

router.get("/:id", controller.getUser);

// router.post("/", controller.addTicket); -- this is in auth

router.put("/:id", middleware.checkRole(["admin"]), controller.updateUser);

router.delete("/:id", middleware.checkRole(["admin"]), controller.deleteUser);

module.exports = router;
