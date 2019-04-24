
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
    const { title, description, imageURL, price } = req.body;

    req.user.createProduct({
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
    const { productId, title, imageURL, price, description } = req.body;

    ProductModel.findByPk(productId)
        .then(product => {
            product.title = title;
            product.price = price;
            product.description = description;
            product.imageURL = imageURL;
            return product.save();
        })
        .then(() => {
            res.redirect('/admin/products');
        })
        .catch(err => {
            console.log(err);
        })
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
    req.user
        .getProducts({
            where: {
                id: prodID
            }
        })
        .then(products => {
            const product = products[0];
            if (!product) {
                res.redirect('/');
            }
            res.render('admin/edit-product', {
                docTitle: "Edit Product",
                path: "/admin/edit-product",
                editing: editMode,
                product
            });
        })
        .catch(err => {
            console.log(err);
        })
}

exports.getProducts = (req, res, next) => {
    req.user
        .getProducts()
        .then(products => {
            res.render("admin/products", {
                prods: products,
                docTitle: "Admin Products",
                path: "/admin/products"
            });
        }).catch(err => {
            console.log(err);
        });
}