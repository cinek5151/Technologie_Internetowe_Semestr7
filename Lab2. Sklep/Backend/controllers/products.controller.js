const productsModel = require("../models/products.model");

exports.createProduct = (req, res) => {
  if (!req.body) {
    return res.status(400).json({ error: "Nazwa oraz cena są wymagane!" });
  }

  const { name, price } = req.body;

  if (!name || !price) {
    return res.status(400).json({ error: "Nazwa oraz cena są wymagane!" });
  }

  if (isNaN(price) || price < 1) {
    return res
      .status(409)
      .json({ error: "Cena musi być liczbą większą od 0!" });
  }

  try {
    const result = productsModel.createProduct(name, price);
    const productId = result.lastInsertRowid;

    res.status(201).location(`/api/products/${productId}`).json({
      id: productId,
      name,
      price,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllProducts = (req, res) => {
  try {
    const products = productsModel.getAllProducts();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
