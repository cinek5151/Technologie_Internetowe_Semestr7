const database = require("../database/database");

exports.createMember = (name, email) => {
  const stmt = database.prepare(
    "INSERT INTO members (name, email) VALUES (?, ?)"
  );
  return stmt.run(name, email);
};

exports.getAllMembers = () => {
  const stmt = database.prepare("SELECT id, name, email FROM members");
  return stmt.all();
};

exports.getMemberById = (id) => {
  const stmt = database.prepare(
    "SELECT id, name, email FROM members WHERE id = ?"
  );
  return stmt.get(id);
};
