const express = require('express');

const productsDisplayController = require('../controllers/products');

const router = express.Router();

router.get('/products', productsDisplayController.getDisplayProducts);

module.exports = router;