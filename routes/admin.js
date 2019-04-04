const express = require('express');
const path = require('path');

const rootDir = require('../utils/path'); 

const router = express.Router();

const products = [];

router.get("/add-product", (req, res) => {
    res.render('add-product', {docTitle: "Add Products", path: "/admin/add-product", productCSS: true, formCSS: true, addProductActive: true});
    // res.sendFile(path.join(rootDir, "views", "add-product.html"));
});

router.post('/add-product', (req, res) => {
    products.push({
        title: req.body.title
    })
    res.redirect('/');
});

module.exports = {
    routes: router,
    products
}