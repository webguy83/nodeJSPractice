exports.getCart = (req, res) => {
    res.render('shop/cart', 
        {
            docTitle: "Cart", 
            path: "/cart", 
        }
    );
}