const getAllBooks = async () => {
  try {
    const response = await fetch("http://localhost:3000/api/books");
    const books = await response.json();
    return books;
  } catch (error) {
    console.error("Błąd podczas pobierania książek:", error);
    return [];
  }
};

const addNewBook = async (book) => {
  const response = await fetch("http://localhost:3000/api/books", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ ...book }),
  });

  return await response.json();
};
const renderBooks = async () => {
  const books = await getAllBooks();
  const booksTable = document.getElementById("books_table_body");
  booksTable.innerHTML = "";

  books.forEach((book) => {
    const tableRow = document.createElement("tr");

    const titleCell = document.createElement("td");
    titleCell.textContent = book.title;
    tableRow.appendChild(titleCell);

    const authorCell = document.createElement("td");
    authorCell.textContent = book.author;
    tableRow.appendChild(authorCell);

    const copiesCell = document.createElement("td");
    copiesCell.textContent = book.copies;
    tableRow.appendChild(copiesCell);

    const borrowedCopies = document.createElement("td");
    borrowedCopies.textContent = book.borrowed_copies;
    tableRow.appendChild(borrowedCopies);

    if (book.copies - book.borrowed_copies > 0) {
      const borrowCell = document.createElement("td");
      const borrowButton = document.createElement("button");
      borrowButton.className = "btn btn-primary btn-sm";
      borrowButton.textContent = "Wypożycz";
      borrowButton.setAttribute("data-bs-toggle", "modal");
      borrowButton.setAttribute("data-bs-target", "#borrowBookModal");
      borrowButton.addEventListener("click", async () => {
        const now = new Date();
        const formattedDate = now.toISOString().split("T")[0];
        document.getElementById("borrowLoanDate").value = formattedDate;

        const dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + 14);
        const formattedDueDate = dueDate.toISOString().split("T")[0];
        document.getElementById("borrowReturnDate").value = formattedDueDate;
        document.getElementById("borrowReturnDate").min = formattedDate;

        document.getElementById("borrowBookId").value = book.id;
      });
      borrowCell.appendChild(borrowButton);
      tableRow.appendChild(borrowCell);
    } else {
      const noAvailableCell = document.createElement("td");
      noAvailableCell.textContent = "Brak dostępnych kopii";
      tableRow.appendChild(noAvailableCell);
    }

    booksTable.appendChild(tableRow);
  });
};

const setMembersInBorrowSelect = async () => {
  const members = await getAllMembers();

  const memberSelect = document.getElementById("borrowMemberSelect");

  members.forEach((member) => {
    const option = document.createElement("option");
    option.value = member.id;
    option.textContent = `${member.name} (${member.email})`;
    memberSelect.appendChild(option);
  });
};

document.addEventListener("DOMContentLoaded", async () => {
  renderBooks();
  setMembersInBorrowSelect();
});

document.getElementById("addBookButton").addEventListener("click", async () => {
  const title = document.getElementById("bookTitle").value;
  const author = document.getElementById("bookAuthor").value;
  const copies = parseInt(document.getElementById("bookCopies").value);

  const newBook = {
    title,
    author,
    copies,
  };

  const addedBook = await addNewBook(newBook);

  if (addedBook.error) {
    alert(addedBook.error);
    return;
  }

  document.getElementById("bookTitle").value = "";
  document.getElementById("bookAuthor").value = "";
  document.getElementById("bookCopies").value = "";

  renderBooks();

  document.getElementById("closeBookModal").click();
});

const addNewLoan = async (loan) => {
  const response = await fetch("http://localhost:3000/api/loans/borrow", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ ...loan }),
  });

  return await response.json();
};

document.getElementById("addLoanButton").addEventListener("click", async () => {
  const bookId = document.getElementById("borrowBookId").value;

  const memberId = document.getElementById("borrowMemberSelect").value;

  const loan_date = document.getElementById("borrowLoanDate").value;
  const due_date = document.getElementById("borrowReturnDate").value;

  const newLoan = { bookId, memberId, loan_date, due_date };

  const addedLoan = await addNewLoan(newLoan);

  if (addedLoan.error) {
    alert(addedLoan.error);
    return;
  }

  document.getElementById("borrowBookId").value = "";
  document.getElementById("borrowMemberSelect").value = "";
  document.getElementById("borrowLoanDate").value = "";
  document.getElementById("borrowReturnDate").value = "";

  renderBooks();
  document.getElementById("closeBorrowModal").click();
});
