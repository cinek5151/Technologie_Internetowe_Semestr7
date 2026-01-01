const database = require("../database/database");

exports.createComment = (author, body, postId) => {
  const stmt = database.prepare(
    "INSERT INTO comments (author, body, post_id) VALUES (?, ?, ?)"
  );
  return stmt.run(author, body, postId);
};

exports.getCommentById = (id) => {
  const stmt = database.prepare(
    "SELECT id, post_id, author, body, approved, created_at FROM comments WHERE id = ?"
  );
  return stmt.get(id);
};

exports.getCommentsToApproved = () => {
  const stmt = database.prepare(
    "SELECT id, post_id, author, body, created_at FROM comments WHERE approved = 0"
  );
  return stmt.all();
};

exports.setCommentAsApproved = (id) => {
  const stmt = database.prepare(
    "UPDATE comments SET approved = 1 WHERE id = ?"
  );
  return stmt.run(id);
};

exports.getApprovedCommentsByPostId = (postId) => {
  const stmt = database.prepare(
    "SELECT id, post_id, author, body, created_at FROM comments WHERE post_id = ? AND approved = 1"
  );
  return stmt.all(postId);
};
