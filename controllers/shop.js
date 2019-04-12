const ProductModel = require('../models/product');
const CartModel = require('../models/cart');

exports.getProducts = (req, res, next) => {
    ProductModel.fetchAllProducts((getProducts) => {
        res.render("shop/product-item", { 
            prods: getProducts, 
            docTitle: "All Products", 
            path: "/products"
        });
    })
}

exports.getProduct = (req, res, next) => {
    const prodID = req.params.prodID;
    ProductModel.findById(prodID, product => {
        res.render("shop/product-detail", {
            product,
            docTitle: product.title,
            path: '/products'
        })
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
    ProductModel.fetchAllProducts((getProducts) => {
        res.render("shop/index", { 
            prods: getProducts, 
            docTitle: "Shop", 
            path: "/"
        });
    })
}

exports.getCart = (req, res, next) => {
    res.render('shop/cart', {
            docTitle: "Cart", 
            path: "/cart"
        }
    );
}

exports.postCart = (req, res, next) => {
    const prodID = req.body.productId;
    ProductModel.findById(prodID, (product) => {
        CartModel.addProduct(prodID, product.price)
    })
    res.render('shop/cart', {
            docTitle: "Cart", 
            path: "/cart"
        }
    );
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