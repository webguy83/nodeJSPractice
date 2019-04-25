const ProductModel = require('../models/product');
const CartModel = require('../models/cart');

exports.getProducts = (req, res, next) => {
    ProductModel.findAll().then(products => {
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

    ProductModel.findByPk(prodID)
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
    ProductModel.findAll().then(products => {
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
        .getCart()
        .then(cart => {
            return cart
                .getProducts()
                .then(products => {
                    res.render('shop/cart', {
                        docTitle: "Cart",
                        path: "/cart",
                        products: products
                    });
                })
        })
        .catch(err => console.log(err))
}

exports.postDeleteCartItem = function (req, res, next) {
    const prodID = req.body.productId;
    req.user
        .getCart()
        .then(cart => {
            return cart.getProducts({ where: { id: prodID } })
        })
        .then(products => {
            const prod = products[0];
            return prod.cartItem.destroy();
        })
        .then(result => {
            res.redirect('/cart');
        })
        .catch(err => console.log(err));
}

exports.postCart = (req, res, next) => {
    const prodID = req.body.productId;
    let fetchCart;
    let newQty = 1;
    req.user.getCart().then(cart => {
        fetchCart = cart;
        return cart.getProducts({ where: { id: prodID } })
    }).then(products => {
        let prod;
        if (products.length > 0) {
            prod = products[0];
        }
        if (prod) {
            newQty = prod.cartItem.quantity + 1;
            return prod;
        }
        return ProductModel.findByPk(prodID);
    })
        .then(product => {
            return fetchCart.addProduct(product, {
                through: {
                    quantity: newQty
                }
            })
        })
        .then(() => {
            res.redirect('/cart');
        })
        .catch(err => console.log(err));
}

exports.postOrder = (req, res, next) => {
    let fetchedCart;
    req.user
        .getCart()
        .then(cart => {
            fetchedCart = cart;
            return cart.getProducts()
        })
        .then(products => {
            return req.user
                .createOrder()
                .then(order => {
                    return order.addProducts(
                        products.map(product => {
                            product.orderItem = { quantity: product.cartItem.quantity }
                            return product;
                        })
                    )
                })
                .catch(err => console.log(err));
        })
        .then(() => {
            return fetchedCart.setProducts(null);
        })
        .then(() => {
            res.redirect('/orders');
        })
        .catch()
}

exports.getOrders = (req, res, next) => {
    req.user
        .getOrders({ include: ["products"]})
        .then(orders => {
            res.render('shop/orders', {
                docTitle: "Orders",
                path: "/orders",
                orders
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