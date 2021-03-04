const express = require("express");
const router = express.Router();

const controller = require("../controllers/rolePermission.controller");

router.get("/", controller.getPermissionForRole);

module.exports = router;
