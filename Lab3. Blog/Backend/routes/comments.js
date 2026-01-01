const express = require("express");
const router = express.Router();
const controller = require("../controllers/comments.controller");

router.get("/to-approve", controller.getCommentsToApproved);
router.post("/:id/approve", controller.setCommentAsApproved);

module.exports = router;
