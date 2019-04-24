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
    ProductModel.findById(prodID, product => {
        CartModel.deleteProduct(prodID, product.price);
        res.redirect("/cart");
    })
}

exports.postCart = (req, res, next) => {
    const prodID = req.body.productId;
    ProductModel.findById(prodID, (product) => {
        CartModel.addProduct(prodID, product.price)
    })
    res.redirect('/cart');
}

exports.getOrders = (req, res, next) => {
    res.render('shop/orders', {
        docTitle: "Orders",
        path: "/orders"
    }
    );
}


exports.getCheckout = (req, res, next) => {
    res.render('shop/checkout',
        {
            docTitle: "Checkout",
            path: "/checkout"
        }
    );
}