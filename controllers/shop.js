const ProductModel = require('../models/product');

exports.getProducts = (req, res, next) => {
    ProductModel.fetchAllProducts((getProducts) => {
        res.render("shop/product-item", 
        { 
            prods: getProducts, 
            docTitle: "All Products", 
            path: "/products"
        });
    })
}

exports.getProduct = (req, res, next) => {
    const prodID = req.params.prodID;
    ProductModel.findById(prodID, product => {
        console.log(product);
    })
    res.redirect('/');
}

exports.getAdminProducts = (req, res, next) => {
    res.render('admin/products', 
        {
            docTitle: "Add Products", 
            path: "/admin/products"
        }
    );
}

exports.getIndex = (req, res, next) => {
    ProductModel.fetchAllProducts((getProducts) => {
        res.render("shop/index", 
        { 
            prods: getProducts, 
            docTitle: "Shop", 
            path: "/"
        });
    })
}

exports.getCart = (req, res, next) => {
    res.render('shop/cart', 
        {
            docTitle: "Cart", 
            path: "/cart"
        }
    );
}

exports.getOrders = (req, res, next) => {
    res.render('shop/orders', 
        {
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