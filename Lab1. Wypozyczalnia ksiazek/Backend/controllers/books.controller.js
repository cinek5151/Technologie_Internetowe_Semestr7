const booksModel = require("../models/books.model");

exports.createBook = (req, res) => {
  if (!req.body) {
    return res
      .status(400)
      .json({ error: "Tytuł, autor oraz ilość są wymagane" });
  }

  const { title, author, copies } = req.body;

  if (!title || !author || !copies) {
    return res
      .status(400)
      .json({ error: "Tytuł, autor oraz ilość są wymagane" });
  }

  if (isNaN(copies) || copies < 1) {
    return res
      .status(409)
      .json({ error: "Ilość musi być liczbą całkowitą większą od 0" });
  }

  try {
    const result = booksModel.createBook(title, author, copies);
    const bookId = result.lastInsertRowid;

    res.status(201).location(`/api/books/${bookId}`).json({
      id: bookId,
      title,
      author,
      copies,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllBooks = (req, res) => {
  try {
    const books = booksModel.getAllBooks();
    res.json(books);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getBookById = (req, res) => {
  const { id } = req.params;

  try {
    const book = booksModel.getBookById(id);

    if (!book) {
      return res.status(404).json({ error: "Książka nie znaleziona" });
    }

    res.json(book);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
