const database = require("../database/database");

const booksModel = require("../models/books.model");
const membersModel = require("../models/members.model");
const loansModel = require("../models/loans.model");

exports.borrowBook = (req, res) => {
  if (!req.body) {
    return res.status(400).json({
      error: "Członek, książka, data wypożyczenia oraz zwrotu są wymagane!",
    });
  }

  const { bookId, memberId, loan_date, due_date } = req.body;

  if (!bookId || !memberId || !loan_date || !due_date) {
    return res.status(400).json({
      error: "Członek, książka, data wypożyczenia oraz zwrotu są wymagane!",
    });
  }

  const book = booksModel.getBookById(bookId);

  if (!book) {
    return res.status(404).json({ error: "Książka nie znaleziona" });
  }

  const member = membersModel.getMemberById(memberId);

  if (!member) {
    return res.status(404).json({ error: "Członek nie znaleziony" });
  }

  const borrowBooks = loansModel.countActiveLoansByBook(bookId);

  if (borrowBooks >= book.copies) {
    return res
      .status(409)
      .json({ error: "Brak dostępnych egzemplarzy książki" });
  }

  try {
    const loan = loansModel.createLoan(memberId, bookId, loan_date, due_date);
    res.status(201).location(`/api/loans`).json(loan);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.returnBook = (req, res) => {
  if (!req.body) {
    return res.status(400).json({
      error: "ID wypożyczenia jest wymagane!",
    });
  }

  const { loanId } = req.body;

  if (!loanId) {
    return res.status(400).json({
      error: "ID wypożyczenia jest wymagane!",
    });
  }

  const loan = loansModel.getLoanById(loanId);

  if (!loan) {
    return res.status(404).json({ error: "Wypożyczenie nie znalezione" });
  }

  if (loan.return_date) {
    return res.status(409).json({ error: "Książka już została zwrócona" });
  }

  try {
    const loan = loansModel.returnLoan(loanId);
    res.status(200).json(loan);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllLoans = (req, res) => {
  try {
    const loans = loansModel.getAllLoans();
    res.json(loans);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
