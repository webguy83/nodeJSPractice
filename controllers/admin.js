const ProductModel = require('../models/product');

exports.getAddProduct = (req, res) => {
    res.render('admin/edit-product', {
        docTitle: "Add Products",
        path: "/admin/add-product",
        editing: false,
        isAuth: req.session.isLoggedIn
    });
}

exports.postAddProduct = (req, res) => {
    const { title, description, imageURL, price } = req.body;
    const product = new ProductModel({title, price, description, imageURL, userId: req.user})

    product.save()
        .then(() => {
            console.log("Product created woohoo!");
            res.redirect("/admin/products");
        })
        .catch(err => {
            console.log(err)
        })

}

exports.postEditProduct = (req, res) => {
    const { productId, title, imageURL, price, description } = req.body;

    ProductModel.findById(productId)
        .then(product => {
            product.title = title;
            product.price = price;
            product.description = description;
            product.imageURL = imageURL;
            return product.save()
        })
        .then(() => {
            console.log("Updated Product!");
            res.redirect("/admin/products");
        })
        .catch(err => console.log(err))
}

exports.postDeleteProduct = (req, res) => {
    ProductModel.findByIdAndRemove(req.body.productId)
        .then(() => {
            console.log("Deleted Product!");
            res.redirect('/admin/products');
        })
        .catch(err => console.log(err));
}

exports.getEditProduct = (req, res) => {
    const editMode = req.query.edit;
    if (!editMode) {
        res.redirect('/')
    }
    const prodID = req.params.productId;
    ProductModel.findById(prodID)
        .then(product => {
            if (!product) {
                res.redirect('/');
            }
            res.render('admin/edit-product', {
                docTitle: "Edit Product",
                path: "/admin/edit-product",
                editing: editMode,
                product,
                isAuth: req.session.isLoggedIn
            });
        })
        .catch(err => {
            console.log(err);
        })
}

exports.getProducts = (req, res, next) => {
    ProductModel.find()
        .then(products => {
            res.render("admin/products", {
                prods: products,
                docTitle: "Admin Products",
                path: "/admin/products",
                isAuth: req.session.isLoggedIn
            });
        }).catch(err => {
            console.log(err);
        });
}