const ProductModel = require('../models/product');

exports.getAddProduct = (req, res) => {
    res.render('add-product', 
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
        res.render("shop", 
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