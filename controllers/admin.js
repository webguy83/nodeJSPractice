
const ProductModel = require('../models/product');

exports.getAddProduct = (req, res) => {
    res.render('admin/edit-product', {
        docTitle: "Add Products",
        path: "/admin/add-product",
        editing: false
    }
    );
}

exports.postAddProduct = (req, res) => {
    const {title, description, imageURL, price } = req.body;
    
    ProductModel.create({
        title,
        price,
        imageURL,
        description
    })
    .then(result => {
        console.log("Product created woohoo!");
    })
    .catch(err => {
        console.log(err)
    })
    
}

exports.postEditProduct = (req, res) => {
    const {productId, title, imageURL, price, description} = req.body;
    const updatedProduct = new ProductModel(productId, title, imageURL, price, description);
    updatedProduct.save();
    res.redirect('/admin/products');
}

exports.postDeleteProduct = (req, res) => {
    ProductModel.deleteById(req.body.productId);
    res.redirect('/admin/products');
}

exports.getEditProduct = (req, res) => {
    const editMode = req.query.edit;
    if (!editMode) {
        res.redirect('/')
    }
    const prodID = req.params.productId;
    ProductModel.findById(prodID, product => {
        if (!product) {
            res.redirect('/');
        }
        res.render('admin/edit-product', {
            docTitle: "Edit Product",
            path: "/admin/edit-product",
            editing: editMode,
            product
        }
        );
    })
}

exports.getProducts = (req, res, next) => {
    ProductModel.fetchAllProducts((getProducts) => {
        res.render("admin/products", {
            prods: getProducts,
            docTitle: "Admin Products",
            path: "/admin/products"
        });
    })
}