const Cart = require('../models/cart');
const db = require("../utils/database");

const getProductsFromPath = function (cb) {
    
}

const Product = function (id, title, imageURL, price, description) {
    this.id = id;
    this.title = title;
    this.imageURL = imageURL;
    this.price = price;
    this.description = description;
}

Product.prototype.save = function () {
   return db.execute("INSERT INTO products (title, price, description, imageURL) VALUES (?, ?, ?, ?)",
   [this.title, this.price, this.description, this.imageURL]);
}

Product.fetchAllProducts = function () {
    return db.execute("SELECT * FROM products");
}

Product.findById = function (id) {
    return db.execute("SELECT * FROM products WHERE products.id = ?", [id]);
}

Product.deleteById = function (id) {
    
}

module.exports = Product;



