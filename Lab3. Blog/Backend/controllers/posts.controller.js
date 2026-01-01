const postsModel = require("../models/posts.model");

exports.createPost = (req, res) => {
  if (!req.body) {
    return res.status(400).json({ error: "Tytuł i treść są wymagane!" });
  }

  const { title, body } = req.body;

  if (!title || !body) {
    return res.status(400).json({ error: "Tytuł i treść są wymagane!" });
  }

  try {
    const result = postsModel.createPost(title, body);
    const postId = result.lastInsertRowid;

    res.status(201).location(`/api/posts`).json({
      id: postId,
      title,
      body,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllPosts = (req, res) => {
  try {
    const posts = postsModel.getAllPosts();
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
