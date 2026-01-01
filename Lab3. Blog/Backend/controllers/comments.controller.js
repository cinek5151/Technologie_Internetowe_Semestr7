const postsModel = require("../models/posts.model");
const commentsModel = require("../models/comments.model");

exports.createComment = (req, res) => {
  if (!req.body) {
    return res.status(400).json({ error: "Autor i treść są wymagane!" });
  }

  const { author, body } = req.body;

  if (!author || !body) {
    return res.status(400).json({ error: "Autor i treść są wymagane!" });
  }

  const post = postsModel.getPostById(req.params.id);

  if (!post) {
    return res.status(404).json({ error: "Post nie znaleziony" });
  }

  try {
    const result = commentsModel.createComment(author, body, req.params.id);
    const commentID = result.lastInsertRowid;

    res
      .status(201)
      .location(`/api/posts/${req.params.id}/comments/${commentID}`)
      .json({
        author,
        body,
      });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getCommentsToApproved = (req, res) => {
  try {
    const comments = commentsModel.getCommentsToApproved();
    res.json(comments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.setCommentAsApproved = (req, res) => {
  const comment = commentsModel.getCommentById(req.params.id);

  if (!comment) {
    return res.status(404).json({ error: "Komentarz nie znaleziony" });
  }

  console.log(comment);

  if (comment.approved) {
    return res.status(409).json({ error: "Komentarz jest już zatwierdzony" });
  }

  try {
    commentsModel.setCommentAsApproved(req.params.id);

    res.sendStatus(200);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getApprovedCommentsByPostId = (req, res) => {
  const post = postsModel.getPostById(req.params.id);

  if (!post) {
    return res.status(404).json({ error: "Post nie znaleziony" });
  }

  try {
    const comments = commentsModel.getApprovedCommentsByPostId(req.params.id);
    res.json(comments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
