const getAllLoans = async () => {
  try {
    const response = await fetch("http://localhost:3000/api/loans");
    const loans = await response.json();
    return loans;
  } catch (error) {
    console.error("Błąd podczas pobierania wypożyczeń:", error);
    return [];
  }
};

const returnBook = async (loanId) => {
  try {
    const response = await fetch(`http://localhost:3000/api/loans/return`, {
      method: "POST",
      body: JSON.stringify({ loanId }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      renderLoans();
    }
  } catch (error) {
    console.error("Błąd podczas zwracania książki:", error);
  }
};

const renderLoans = async () => {
  const loans = await getAllLoans();

  const loansTable = document.getElementById("loans_table_body");
  loansTable.innerHTML = "";

  loans.forEach((loan) => {
    const tableRow = document.createElement("tr");

    const idCell = document.createElement("th");
    idCell.scope = "row";
    idCell.textContent = loan.loan_id;
    tableRow.appendChild(idCell);

    const memberCell = document.createElement("td");
    memberCell.textContent = loan.member_name;
    tableRow.appendChild(memberCell);

    const bookCell = document.createElement("td");
    bookCell.textContent = loan.book_author + " - " + loan.book_title;
    tableRow.appendChild(bookCell);

    const loanDateCell = document.createElement("td");
    loanDateCell.textContent = loan.loan_date;
    tableRow.appendChild(loanDateCell);

    const dueDateCell = document.createElement("td");
    dueDateCell.textContent = loan.due_date;
    tableRow.appendChild(dueDateCell);

    const returnDateCell = document.createElement("td");

    if (loan.return_date) {
      returnDateCell.textContent = loan.return_date;
    } else {
      const returnButton = document.createElement("button");
      returnButton.type = "button";
      returnButton.className = "btn btn-primary btn-sm";
      returnButton.textContent = "Zwróć książkę";
      returnButton.addEventListener("click", async () => {
        returnBook(loan.loan_id);
      });
      returnDateCell.appendChild(returnButton);
    }
    tableRow.appendChild(returnDateCell);

    loansTable.appendChild(tableRow);
  });
};

document.addEventListener("DOMContentLoaded", () => {
  renderLoans();
});
