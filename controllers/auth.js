const User = require("../models/user");

exports.getLogin = function(req, res, next) {

    res.render('auth/login', {
        docTitle: "Login",
        path: "/login",
        isAuth: false
    });
}

exports.postLogin = function(req, res, next) {
    User.findById("5ccd3096ee58a72080896eac")
        .then(user => {
            req.session.isLoggedIn = true;
            req.session.user = user;
            req.session.save((err) => {
                console.log(err)
                res.redirect('/');
            })
        })
        .catch(err => console.log(err));
}

exports.postLogout = function(req, res, next) {
    req.session.destroy(err => {
        console.log(err);
        res.redirect('/');
    })
}