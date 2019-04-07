const products = [];

const Product = function(title) {
    this.title = title;
}

Product.prototype.save = function() {
    products.push(this);
}

Product.fetchAllProducts = function() {
    return products;
}

module.exports = Product;



