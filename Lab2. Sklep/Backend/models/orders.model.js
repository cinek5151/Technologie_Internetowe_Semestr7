const database = require("../database/database");

exports.checkout = (sessionId) => {
  const cartItems = database
    .prepare(
      `
    SELECT 
      cart_items.product_id, 
      cart_items.qty, 
      products.price
    FROM cart_items
    JOIN products 
      ON cart_items.product_id = products.id
    WHERE cart_items.session_id = ?
  `
    )
    .all(sessionId);

  const orderStmt = database.prepare(`
    INSERT INTO orders (created_at) 
    VALUES (CURRENT_TIMESTAMP)
  `);
  const orderInfo = orderStmt.run();
  const orderId = orderInfo.lastInsertRowid;

  const orderItemStmt = database.prepare(`
    INSERT INTO order_items (order_id, product_id, qty, price)
    VALUES (?, ?, ?, ?)
  `);

  let total = 0;
  for (const item of cartItems) {
    orderItemStmt.run(orderId, item.product_id, item.qty, item.price);
    total += item.qty * item.price;
  }

  database
    .prepare(
      `
    DELETE FROM cart_items 
    WHERE session_id = ?
  `
    )
    .run(sessionId);

  return { orderId, total };
};
