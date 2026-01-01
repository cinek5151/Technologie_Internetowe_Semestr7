const express = require("express");
const router = express.Router();
const controller = require("../controllers/carts.controller");

router.get("/", controller.getAllProductsInCart);
router.post("/add", controller.addProductToCart);
router.patch("/item", controller.updateCartItem);
router.delete("/item/:productId", controller.deleteProductFromCart);

module.exports = router;
