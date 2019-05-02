const ProductModel = require('../models/product');

exports.getProducts = (req, res, next) => {
    ProductModel.fetchAllProducts().then(products => {
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
    ProductModel.fetchAllProducts().then(products => {
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
        .then(products => {
            res.render('shop/cart', {
                docTitle: "Cart",
                path: "/cart",
                products: products
            });
        })
        .catch (err => console.log(err))
}

exports.postDeleteCartItem = function (req, res, next) {
    const prodID = req.body.productId;
    req.user
        .deleteFromCart(prodID)
        .then(result => {
            console.log(result)
            res.redirect("/cart");
        })
}

exports.postCart = (req, res, next) => {
    const prodID = req.body.productId;
    ProductModel.findById(prodID)
        .then(product => {
            return req.user.addToCart(product);
        })
        .then(result => {
            console.log(result)
            res.redirect("/cart")
        })
        .catch(err => console.log(err));
}

exports.postOrder = (req, res, next) => {
    req.user
        .addOrders()
        .then(() => {
            res.redirect('/orders');
        })
        .catch(err => console.log(err))
}

exports.getOrders = (req, res, next) => {
    req.user
        .getOrders()
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