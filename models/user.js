const mongoDb = require('mongodb');
const getDb = require('../utils/database').getDb;

const User = function (name, email, cart, id) {
    this.name = name;
    this.email = email;
    this.cart = cart;
    this._id = id;
}

User.prototype.addOrders = function () {
    const db = getDb();
    return this.getCart()
        .then(products => {
            const order = {
                items: products,
                user: {
                    _id: new mongoDb.ObjectId(this._id),
                    name: this.name
                }
            }
            return db.collection('orders').insertOne(order);
        })
        .then(() => {
            this.cart = { item: [] }
            return db.collection('users').updateOne(
                { _id: new mongoDb.ObjectId(this._id) },
                { $set: { cart: { items: [] } } })
        })
        .catch(err => console.log(err))
}

User.prototype.getOrders = function() {
    const db = getDb();
    return db.collection('orders').find({
        "user._id" : new mongoDb.ObjectId(this._id)
    })
    .toArray();
}

User.prototype.getCart = function () {
    const db = getDb();
    const pIds = this.cart.items.map(item => {
        return item.productId;
    })
    return db.collection('products').find({
        _id: {
            $in: pIds
        }
    })
        .toArray()
        .then(products => {
            return products.map(product => {
                return {
                    ...product,
                    qty: this.cart.items.find(item => {
                        return item.productId.toString() === product._id.toString();
                    }).qty
                }
            })
        })
        .catch(err => console.log(err))
}

User.prototype.addToCart = function (product) {
    const cartProductIndex = this.cart.items.findIndex(cp => {
        return cp.productId.toString() === product._id.toString();
    });

    let newQty = 1;
    const updatedCartItems = [...this.cart.items];

    if (cartProductIndex >= 0) {
        // increment the cart qty
        newQty = this.cart.items[cartProductIndex].qty + 1;
        updatedCartItems[cartProductIndex].qty = newQty;
    } else {
        updatedCartItems.push({
            productId: new mongoDb.ObjectId(product._id),
            qty: newQty
        })
    }
    const updatedCart = {
        items: updatedCartItems
        //items: [{ productId: new mongoDb.ObjectId(product._id), qty: 1 }]
    }
    const db = getDb();
    return db.collection('users').updateOne(
        { _id: new mongoDb.ObjectId(this._id) },
        { $set: { cart: updatedCart } })
}

User.prototype.deleteFromCart = function (id) {
    const db = getDb();
    const updatedCartItems = this.cart.items.filter(item => {
        return item.productId.toString() !== id.toString();
    })

    return db.collection('users').updateOne(
        { _id: new mongoDb.ObjectId(this._id) },
        { $set: { cart: { items: updatedCartItems } } })
}

User.prototype.save = function () {
    const db = getDb();
    return db.collection("users").insertOne(this)
}

User.findById = function (id) {
    const db = getDb();
    return db.collection("users")
        .findOne({
            _id: new mongoDb.ObjectId(id)
        })
}

module.exports = User;