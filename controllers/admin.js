
const ProductModel = require('../models/product');

exports.getAddProduct = (req, res) => {
    res.render('admin/add-product', 
        {
            docTitle: "Add Products", 
            path: "/admin/add-product"
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
        res.render("admin/products", 
        { 
            prods: getProducts, 
            docTitle: "Admin Products", 
            path: "/admin/products"
        });
    })
}