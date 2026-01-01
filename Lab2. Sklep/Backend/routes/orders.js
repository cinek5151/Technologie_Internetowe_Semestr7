const express = require("express");
const router = express.Router();
const controller = require("../controllers/orders.controller");

router.post("/", controller.checkout);

module.exports = router;
