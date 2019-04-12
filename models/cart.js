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

module.exports = Cart;


