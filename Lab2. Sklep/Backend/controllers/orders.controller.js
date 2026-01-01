const cartsModel = require("../models/carts.model");
const productsModel = require("../models/products.model");
const ordersModel = require("../models/orders.model");

exports.checkout = (req, res) => {
  const cartItems = cartsModel.getAllProductsInCart(req.sessionID);
  if (cartItems.length === 0) {
    return res.status(409).json({ error: "Koszyk jest pusty!" });
  }

  try {
    const result = ordersModel.checkout(req.sessionID);
    res.status(201).json({
      orderId: result.orderId,
      total: result.total,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateCartItem = (req, res) => {
  if (!req.body) {
    return res
      .status(400)
      .json({ error: "ID produktu oraz ilość są wymagane!" });
  }

  const { productId, qty } = req.body;

  if (!productId || !qty) {
    return res
      .status(400)
      .json({ error: "ID produktu oraz ilość są wymagane!" });
  }

  if (isNaN(qty) || qty < 1) {
    return res
      .status(409)
      .json({ error: "Ilość musi być liczbą większą od 0!" });
  }

  const product = productsModel.getProductById(productId);
  if (!product) {
    return res
      .status(404)
      .json({ error: "Produkt o podanym ID nie istnieje!" });
  }

  const cartItem = cartsModel.getCartItemById(req.sessionID, productId);

  if (!cartItem) {
    return res
      .status(409)
      .json({ error: "Produkt nie znajduje się w koszyku!" });
  }

  try {
    cartsModel.updateCartItem(req.sessionID, productId, qty);

    res.status(200).json({
      id: cartItem.id,
      name: product.name,
      qty: qty,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
