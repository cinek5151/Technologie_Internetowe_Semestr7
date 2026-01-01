const express = require("express");
const router = express.Router();
const controller = require("../controllers/loans.controller");

router.get("/", controller.getAllLoans);
router.post("/borrow", controller.borrowBook);
router.post("/return", controller.returnBook);

module.exports = router;
