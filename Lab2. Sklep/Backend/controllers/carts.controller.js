const cartsModel = require("../models/carts.model");
const productsModel = require("../models/products.model");

exports.addProductToCart = (req, res) => {
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
  if (cartItem) {
    return res
      .status(409)
      .json({ error: "Produkt już znajduje się w koszyku!" });
  }

  try {
    const result = cartsModel.addToCart(req.sessionID, productId, qty);
    const cartItemId = result.lastInsertRowid;

    res.status(201).json({
      productId: product.id,
      qty: qty,
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
      productId: product.id,
      qty: qty,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteProductFromCart = (req, res) => {
  const { productId } = req.params;

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
    cartsModel.removeCartItem(req.sessionID, productId);

    res.sendStatus(204);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllProductsInCart = (req, res) => {
  try {
    const cartItems = cartsModel.getAllProductsInCart(req.sessionID);
    res.json(cartItems);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
