const ProductModel = require('../models/product');

exports.getAddProduct = (req, res) => {
    res.render('admin/add-product', 
        {
            docTitle: "Add Products", 
            path: "/admin/add-product", 
            productCSS: true, 
            formCSS: true, 
            addProductActive: true
        }
    );
}

exports.postAddProduct = (req, res) => {
    const product = new ProductModel(req.body.title)
    product.save();
    res.redirect('/');
}

exports.getProducts = (req, res, next) => {
    ProductModel.fetchAllProducts((getProducts) => {
        res.render("shop/product-item", 
        { 
            prods: getProducts, 
            docTitle: "Shop", 
            path: "/", 
            hasProducts: getProducts.length > 0, 
            productCSS: true, 
            shopActive: true 
        });
    })
}

exports.getAdminProducts = (req, res, next) => {
    res.render('admin/products', 
        {
            docTitle: "Add Products", 
            path: "/admin/products"
        }
    );
}

exports.getDisplayProducts = (req, res, next) => {
    res.render('shop/index', 
        {
            docTitle: "Show the Products", 
            path: "/products"
        }
    );
}