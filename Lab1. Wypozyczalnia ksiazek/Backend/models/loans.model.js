const database = require("../database/database");

exports.countActiveLoansByBook = (bookId) => {
  const stmt = database.prepare(`
    SELECT COUNT(*) AS borrowed_count
    FROM loans
    WHERE book_id = ? AND return_date IS NULL
  `);
  const result = stmt.get(bookId);
  return result.borrowed_count;
};

exports.createLoan = (memberId, bookId, loan_date, due_date) => {
  const stmt = database.prepare(`
    INSERT INTO loans (member_id, book_id, loan_date, due_date)
    VALUES (?, ?, ?, ?)
  `);

  const result = stmt.run(memberId, bookId, loan_date, due_date);
  return {
    id: result.lastInsertRowid,
    memberId,
    bookId,
    loan_date,
    due_date,
  };
};

exports.getLoanById = (id) => {
  const stmt = database.prepare(
    "SELECT id, member_id, book_id, loan_date, due_date, return_date FROM loans WHERE id = ?"
  );
  return stmt.get(id);
};

exports.returnLoan = (loanId) => {
  const stmt = database.prepare(`
    UPDATE loans
    SET return_date = CURRENT_TIMESTAMP
    WHERE id = ? AND return_date IS NULL
  `);

  const result = stmt.run(loanId);

  return {
    success: result.changes > 0,
    loanId,
  };
};

exports.getAllLoans = () => {
  const stmt = database.prepare(`
    SELECT
      loans.id AS loan_id,
      loans.loan_date,
      loans.due_date,
      loans.return_date,

      members.id AS member_id,
      members.name AS member_name,
      members.email AS member_email,

      books.id AS book_id,
      books.title AS book_title,
      books.author AS book_author,
      books.copies AS total_copies,

      (
        SELECT COUNT(*)
        FROM loans l2
        WHERE l2.book_id = books.id
          AND l2.return_date IS NULL
      ) AS borrowed_copies

    FROM loans
    JOIN members ON members.id = loans.member_id
    JOIN books ON books.id = loans.book_id
    ORDER BY loans.loan_date DESC
  `);

  return stmt.all();
};
