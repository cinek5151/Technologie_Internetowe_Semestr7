const database = require("../database/database");

exports.createPost = (title, body) => {
  const stmt = database.prepare(
    "INSERT INTO posts (title, body) VALUES (?, ?)"
  );
  return stmt.run(title, body);
};

exports.getAllPosts = () => {
  const stmt = database.prepare(
    "SELECT id, title, body, created_at FROM posts"
  );
  return stmt.all();
};

exports.getPostById = (id) => {
  const stmt = database.prepare(
    "SELECT id, title, body, created_at FROM posts WHERE id = ?"
  );
  return stmt.get(id);
};
