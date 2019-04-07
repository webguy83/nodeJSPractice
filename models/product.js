const fs = require('fs');
const path = require('path');

const newPath = path.join(path.dirname(process.mainModule.filename), 'data', 'products.json');

const getProductsFromPath = function(cb) {
    fs.readFile(newPath, (err, fileContent) => {
        if(err) {
            cb([]);
        } else {
            cb(JSON.parse(fileContent));
        }
    })
}

const Product = function(title) {
    this.title = title;
}

Product.prototype.save = function() {
    getProductsFromPath((products) => {
        products.push(this);
        fs.writeFile(newPath, JSON.stringify(products), (err) => {
            console.log(err);
        })
    });
    //products.push(this);
}

Product.fetchAllProducts = function(cb) {
    getProductsFromPath(cb);
}

module.exports = Product;



