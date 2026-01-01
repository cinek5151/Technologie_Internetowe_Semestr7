const membersModel = require("../models/members.model");

exports.createMember = (req, res) => {
  if (!req.body) {
    return res.status(400).json({ error: "Nazwa i email są wymagane" });
  }

  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).json({ error: "Nazwa i email są wymagane" });
  }

  try {
    const result = membersModel.createMember(name, email);
    const memberId = result.lastInsertRowid;

    res.status(201).location(`/api/members/${memberId}`).json({
      id: memberId,
      name,
      email,
    });
  } catch (err) {
    if (err.code === "SQLITE_CONSTRAINT_UNIQUE") {
      return res.status(409).json({ error: "Email nie jest unikalny!" });
    }
    res.status(500).json({ error: err.message });
  }
};

exports.getAllMembers = (req, res) => {
  try {
    const members = membersModel.getAllMembers();
    res.json(members);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getMemberById = (req, res) => {
  const { id } = req.params;

  try {
    const member = membersModel.getMemberById(id);

    if (!member) {
      return res.status(404).json({ error: "Członek nie znaleziony" });
    }

    res.json(member);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
