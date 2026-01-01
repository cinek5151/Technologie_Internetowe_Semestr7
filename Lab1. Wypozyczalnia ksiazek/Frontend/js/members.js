const getAllMembers = async () => {
  try {
    const response = await fetch("http://localhost:3000/api/members");
    const members = await response.json();
    return members;
  } catch (error) {
    console.error("Błąd podczas pobierania członków:", error);
    return [];
  }
};

const addNewMember = async (member) => {
  const response = await fetch("http://localhost:3000/api/members", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ ...member }),
  });

  return await response.json();
};
const renderMembers = async () => {
  const members = await getAllMembers();
  const membersTable = document.getElementById("members_table_body");
  membersTable.innerHTML = "";

  members.forEach((member) => {
    const tableRow = document.createElement("tr");

    const idCell = document.createElement("th");
    idCell.scope = "row";
    idCell.textContent = member.id;
    tableRow.appendChild(idCell);

    const nameCell = document.createElement("td");
    nameCell.textContent = member.name;
    tableRow.appendChild(nameCell);

    const emailCell = document.createElement("td");
    emailCell.textContent = member.email;
    tableRow.appendChild(emailCell);

    membersTable.appendChild(tableRow);
  });
};

document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("members_table_body")) {
    renderMembers();
  }
});

if (document.getElementById("addMemberButton")) {
  document
    .getElementById("addMemberButton")
    .addEventListener("click", async () => {
      const name = document.getElementById("memberName").value;
      const email = document.getElementById("memberEmail").value;

      const newMember = {
        name,
        email,
      };

      const addedMember = await addNewMember(newMember);
      if (addedMember.error) {
        alert(addedMember.error);
        return;
      }

      document.getElementById("memberName").value = "";
      document.getElementById("memberEmail").value = "";

      renderMembers();
      document.getElementById("closeMemberModal").click();
    });
}
