const database = require("../database/database");

exports.createProduct = (name, price) => {
  const stmt = database.prepare(
    "INSERT INTO products (name, price) VALUES (?, ?)"
  );
  return stmt.run(name, price);
};

exports.getAllProducts = () => {
  const stmt = database.prepare("SELECT id, name, price FROM products");
  return stmt.all();
};

exports.getProductById = (id) => {
  const stmt = database.prepare(
    "SELECT id, name, price FROM products WHERE id = ?"
  );
  return stmt.get(id);
};
