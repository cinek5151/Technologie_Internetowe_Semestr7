const database = require("../database/database");

exports.createBook = (title, author, copies) => {
  const stmt = database.prepare(
    "INSERT INTO books (title, author, copies) VALUES (?, ?, ?)"
  );
  return stmt.run(title, author, copies);
};

exports.getAllBooks = () => {
  const stmt = database.prepare(`
    SELECT
      books.id,
      books.title,
      books.author,
      books.copies,

      COUNT(loans.id) AS borrowed_copies
    FROM books
    LEFT JOIN loans
      ON loans.book_id = books.id
      AND loans.return_date IS NULL
    GROUP BY books.id
    ORDER BY books.title
  `);

  return stmt.all();
};

exports.getBookById = (id) => {
  const stmt = database.prepare(
    "SELECT id, title, author, copies FROM books WHERE id = ?"
  );
  return stmt.get(id);
};
