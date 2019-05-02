const mongoDb = require('mongodb');
const getDb = require('../utils/database').getDb;

const Product = function (title, price, description, imageURL, id, userId) {
    this.title = title;
    this.price = price;
    this.description = description;
    this.imageURL = imageURL;
    this._id = id ? new mongoDb.ObjectId(id) : null;
    this.userId = userId;
};

Product.prototype.save = function () {
    const db = getDb();
    let dbOp;
    if (this._id) {
        dbOp = db.collection('products').updateOne({ _id: (this._id) }, { $set: this })
    } else {
        dbOp = db.collection('products').insertOne(this);
    }
    return dbOp
        .then(result => {
            console.log(result)
        })
        .catch(err => console.log(err));
}

Product.fetchAllProducts = function () {
    const db = getDb();
    return db.collection('products')
        .find()
        .toArray()
        .then(products => {
            return products;
        })
        .catch(err => console.log(err));
}

Product.findById = function (id) {
    const db = getDb();
    return db.collection('products')
        .find({ _id: new mongoDb.ObjectId(id) })
        .next()
        .then(product => {
            return product;
        })
        .catch(err => console.log(err));
}

Product.deleteById = function (id) {
    const db = getDb();
    const op = db.collection('products').deleteOne({ _id: new mongoDb.ObjectId(id) })

    return op
        .then(() => {
            console.log("Product Deleted")
        })
        .catch(err => console.log(err));
}

module.exports = Product;