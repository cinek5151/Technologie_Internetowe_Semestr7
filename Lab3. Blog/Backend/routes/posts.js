const express = require("express");
const router = express.Router();
const postsController = require("../controllers/posts.controller");
const commentsController = require("../controllers/comments.controller");

router.get("/", postsController.getAllPosts);
router.post("/", postsController.createPost);

router.post("/:id/comments", commentsController.createComment);
router.get("/:id/comments", commentsController.getApprovedCommentsByPostId);

module.exports = router;
