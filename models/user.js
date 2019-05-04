const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    cart: {
        items: [{
            productId: {
                type: Schema.Types.ObjectId,
                ref: "Product",
                required: true
            },
            qty: {
                type: Number,
                required: true
            }
        }],
        totalPrice: {
            type: Number,
            //required: true
        }
    }
})

const getTotalPrice = function(products) {
    console.log(products)
    let price = 0;
    products.forEach(product => {
        const q = product.qty;
        const p = product.productId.price;
        price += p * q;
    });
    return price;
}

userSchema.methods.addToCart = function (product) {
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
            productId: product._id,
            qty: newQty
        })
    }
    //console.log(getTotalPrice(updatedCartItems))
    const updatedCart = {
        items: updatedCartItems
        //totalPrice: getTotalPrice(updatedCartItems)
    }
    this.cart = updatedCart;
    return this.save();
}

userSchema.methods.deleteFromCart = function (id) {
    const updatedCartItems = this.cart.items.filter(item => {
        return item.productId.toString() !== id.toString();
    });
    this.cart.items = updatedCartItems;
    return this.save();
}

userSchema.methods.clearCart = function () {
    this.cart = {
        items: []
    }
    return this.save();
}



module.exports = mongoose.model("User", userSchema);