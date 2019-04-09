
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
    const {title, description, imageURL, price} = req.body;
    const product = new ProductModel(title, imageURL, price, description);
    product.save();
    res.redirect('/products');
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