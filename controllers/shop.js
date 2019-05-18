const ProductModel = require('../models/product');
const OrderModel = require('../models/order');

exports.getProducts = (req, res, next) => {
    ProductModel.find().then(products => {
        res.render("shop/product-item", {
            prods: products,
            docTitle: "All Products",
            path: "/products"
        });
    }).catch(err => {
        console.log(err);
    });
}

exports.getProduct = (req, res, next) => {
    const prodID = req.params.prodID;
    ProductModel.findById(prodID)
        .then(product => {
            res.render("shop/product-detail", {
                product: product,
                docTitle: product.title,
                path: '/products'
            })
        })
        .catch(err => {
            console.log(err);
        })
}

exports.getAdminProducts = (req, res, next) => {
    res.render('admin/products', {
        docTitle: "Add Products",
        path: "/admin/products"
    }
    );
}

exports.getIndex = (req, res, next) => {
    ProductModel.find().then(products => {
        res.render("shop/index", {
            prods: products,
            docTitle: "Shop",
            path: "/"
        });
    }).catch(err => {
        console.log(err);
    });
}

exports.getCart = (req, res, next) => {
    req.user
        .populate('cart.items.productId')
        .execPopulate()
        .then(user => {
            const products = user.cart.items;
            let totalPrice = 0;
            products.forEach(prod => {
                const qty = prod.qty;
                const price = prod.productId.price;
                totalPrice += price * qty;
            });
            res.render('shop/cart', {
                docTitle: "Cart",
                path: "/cart",
                products,
                totalPrice
            });
        })
        .catch(err => console.log(err))
}

exports.postDeleteCartItem = function (req, res, next) {
    const prodID = req.body.productId;
    req.user
        .deleteFromCart(prodID)
        .then(() => {
            res.redirect("/cart");
        })
}

exports.postCart = (req, res, next) => {
    const prodID = req.body.productId;
    ProductModel.findById(prodID)
        .then(product => {
            return req.user.addToCart(product);
        })
        .then(() => {
            res.redirect("/cart")
        })
        .catch(err => console.log(err));
}

exports.postOrder = (req, res, next) => {
    req.user
        .populate('cart.items.productId')
        .execPopulate()
        .then(user => {
            let orderTotalPrice = 0;
            const items = user.cart.items.map(item => {
                orderTotalPrice += item.productId.price * item.qty
                return {
                    qty: item.qty,
                    product: { ...item.productId._doc }
                }
            });
            const order = new OrderModel({
                user: {
                    email: req.user.email,
                    userId: req.user
                },
                items,
                orderTotalPrice
            });
            return order.save();
        })
        .then(() => {
            return req.user.clearCart()
        })
        .then(() => {
            res.redirect('/orders');
        })
        .catch(err => console.log(err))
}

exports.getOrders = (req, res, next) => {
    OrderModel.find({
        "user.userId": req.user._id
    })
    .then(orders => {
        let ordersTotal = 0;
        orders.forEach(order => {
            ordersTotal += order.orderTotalPrice
        });
        res.render('shop/orders', {
            docTitle: "Orders",
            path: "/orders",
            orders,
            ordersTotal
        });
    })
    .catch(err => console.log(err));
}


exports.getCheckout = (req, res, next) => {
    res.render('shop/checkout',
        {
            docTitle: "Checkout",
            path: "/checkout"
        }
    );
}