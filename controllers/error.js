exports.getErrorPage = (req, res, next) => {
    res.status(404).render('error', {docTitle: "Error and can't be found!", path: "/", isAuth: req.session.isLoggedIn})
}