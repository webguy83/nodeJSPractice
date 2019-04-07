const products = [];

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
    products.push({
        title: req.body.title
    });
    res.redirect('/');
}

exports.getProducts = (req, res, next) => {
    res.render("shop", 
        { 
            prods: products, 
            docTitle: "Shop", 
            path: "/", 
            hasProducts: products.length > 0, 
            productCSS: true, 
            shopActive: true 
        });
}