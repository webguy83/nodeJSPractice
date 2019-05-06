exports.getDonkeyPage = (req, res, next) => {
    res.render('donkey', {docTitle: "Shop", path: "/animals/donkey", isAuth: req.session.isLoggedIn})
}