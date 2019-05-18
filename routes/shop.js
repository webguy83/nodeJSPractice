const express = require('express');

const shopController = require('../controllers/shop');
const authCheck = require('../middlewares/authCheck');

const router = express.Router();

router.get("/", shopController.getIndex)
router.get("/products", shopController.getProducts);
router.get("/products/:prodID", shopController.getProduct);
router.get("/cart", authCheck, shopController.getCart);
router.post("/cart", authCheck, shopController.postCart);
router.post("/delete-cart-item", authCheck, shopController.postDeleteCartItem);
router.post("/create-order", authCheck, shopController.postOrder);
router.get("/orders", authCheck, shopController.getOrders);
// router.get("/checkout", shopController.getCheckout);

module.exports = router;