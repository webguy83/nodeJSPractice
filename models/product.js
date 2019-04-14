const fs = require('fs');
const path = require('path');

const newPath = path.join(path.dirname(process.mainModule.filename), 'data', 'products.json');

const getProductsFromPath = function (cb) {
    fs.readFile(newPath, (err, fileContent) => {
        if (err) {
            cb([]);
        } else {
            cb(JSON.parse(fileContent));
        }
    })
}

const Product = function (id, title, imageURL, price, description) {
    this.id = id;
    this.title = title;
    this.imageURL = imageURL;
    this.price = price;
    this.description = description;
}

Product.prototype.save = function () {
    getProductsFromPath((products) => {
        if (this.id) { // we update product
            const existingProductIndex = products.findIndex((product) => {
                return product.id === this.id;
            });
            const updatedProducts = [...products];
            updatedProducts[existingProductIndex] = this;

            fs.writeFile(newPath, JSON.stringify(updatedProducts), (err) => {
                console.log(err);
            })
        } else {
            this.id = Math.random().toString();
            products.push(this);
            fs.writeFile(newPath, JSON.stringify(products), (err) => {
                console.log(err);
            })
        }
    });
    //products.push(this);
}

Product.fetchAllProducts = function (cb) {
    getProductsFromPath(cb);
}

Product.findById = function (id, cb) {
    getProductsFromPath(products => {
        const product = products.find(p => {
            return p.id.toString() === id;
        });
        cb(product);
    })
}

Product.deleteById = function (id) {
    getProductsFromPath(products => {
        const updatedProducts = products.filter(product => {
            return product.id.toString() !== id;
        });
        fs.writeFile(newPath, JSON.stringify(updatedProducts), (err) => {
            console.log(err);
        })
    })
}



module.exports = Product;



