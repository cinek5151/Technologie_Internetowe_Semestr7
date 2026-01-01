const database = require("../database/database");

exports.addToCart = (sessionId, productId, qty) => {
  const stmt = database.prepare(
    "INSERT INTO cart_items (session_id, product_id, qty) VALUES (?, ?, ?)"
  );
  return stmt.run(sessionId, productId, qty);
};

exports.updateCartItem = (sessionId, productId, qty) => {
  const stmt = database.prepare(
    "UPDATE cart_items SET qty = ? WHERE session_id = ? AND product_id = ?"
  );
  return stmt.run(qty, sessionId, productId);
};

exports.getCartItemById = (sessionId, productId) => {
  const stmt = database.prepare(
    "SELECT id, session_id, product_id, qty FROM cart_items WHERE session_id = ? AND product_id = ?"
  );
  return stmt.get(sessionId, productId);
};

exports.removeCartItem = (sessionId, productId) => {
  const stmt = database.prepare(`
    DELETE FROM cart_items
    WHERE session_id = ?
      AND product_id = ?
  `);

  return stmt.run(sessionId, productId);
};

exports.getAllProductsInCart = (sessionId) => {
  const stmt = database.prepare(`
    SELECT
      cart_items.id,
      cart_items.product_id,
      cart_items.qty,
      products.name,
      products.price,
      (cart_items.qty * products.price) AS total_item_price
    FROM cart_items
    JOIN products
      ON cart_items.product_id = products.id
    WHERE cart_items.session_id = ?
    ORDER BY cart_items.id DESC
  `);

  return stmt.all(sessionId);
};
