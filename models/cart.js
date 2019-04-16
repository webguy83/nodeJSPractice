const fs = require('fs');
const path = require('path');

const cartJSONPath = path.join(path.dirname(process.mainModule.filename), 'data', 'cart.json');

const Cart = function() {}

Cart.addProduct = function(id, productPrice) {
    //get previous cart
    fs.readFile(cartJSONPath, (err, fileContent) => {
        let cart = {
            products: [],
            totalPrice: 0
        }
        if(!err)  {
            cart = JSON.parse(fileContent);
        }

        const existingProductFromJSONindex = cart.products.findIndex(product => product.id === id);
        const existingProductFromJSON = cart.products[existingProductFromJSONindex];

        let updatedProduct;

        if(existingProductFromJSON) {// if the JSON data file exists
            updatedProduct = {...existingProductFromJSON};
            updatedProduct.qty++;
            cart.products = [...cart.products];
            cart.products[existingProductFromJSONindex] = updatedProduct;
        } else {
            updatedProduct = {id, qty: 1}
            cart.products = [...cart.products, updatedProduct];
        }
        cart.totalPrice = cart.totalPrice + Number(productPrice);
        fs.writeFile(cartJSONPath, JSON.stringify(cart), (err) => {
            console.log(err);
        })
    })
}

Cart.deleteProduct = function(id, productPrice) {
    fs.readFile(cartJSONPath, (err, fileContent) => {
        if(err) {
            return;
        }
        const updatedCart = {...JSON.parse(fileContent)};
        const product = updatedCart.products.find(prod => prod.id === id);
        if(!product) {
            return;
        }
        updatedCart.products = updatedCart.products.filter(prod => prod.id !== id);
        updatedCart.totalPrice = updatedCart.totalPrice - productPrice * product.qty;

        fs.writeFile(cartJSONPath, JSON.stringify(updatedCart), (err) => {
            console.log(err);
        })
    })
}

Cart.getCart = function(cb) {
    fs.readFile(cartJSONPath, (err, fileContent) => {
        if(err) {
            cb(null);
        } else {
            cb(JSON.parse(fileContent));
        }
    });
}

module.exports = Cart;


