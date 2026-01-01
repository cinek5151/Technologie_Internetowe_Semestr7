const express = require("express");
const router = express.Router();
const controller = require("../controllers/members.controller");

router.post("/", controller.createMember);
router.get("/", controller.getAllMembers);
router.get("/:id", controller.getMemberById);

module.exports = router;