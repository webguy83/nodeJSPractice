const User = require("../models/user");
const bcrypt = require('bcrypt');

exports.getLogin = function (req, res, next) {

    res.render('auth/login', {
        docTitle: "Login",
        path: "/login",
        errorMsg: req.flash('error')
    });
}

exports.postLogin = function (req, res, next) {
    // get the user email and password
    // find the user in database
    // if the user cant be found send them back to login page
    // compare the hashed password with use password
    // once that is finished match the user password with the crypted password
    // if that is true add a session or just redirect to login
    const { email, password } = req.body;
    User.findOne({ email })
        .then(user => {
            if (!user) {
                req.flash('error', "Wrong username and/or password!");
                return res.redirect('/login')
            }
            bcrypt.compare(password, user.password)
                .then(doTheseMatch => {
                    if (doTheseMatch) {
                        req.session.isLoggedIn = true;
                        req.session.user = user;
                        return req.session.save(err => {
                            console.log(err);
                            res.redirect('/')
                        })
                    }
                    req.flash('error', "Wrong username and/or password!");
                    res.redirect('/login');
                })
        })
        .catch(err => console.log(err))
}

exports.postLogout = function (req, res, next) {
    req.session.destroy(err => {
        console.log(err);
        res.redirect('/');
    })
}

exports.getSignup = function (req, res, next) {
    res.render('auth/signup', {
        docTitle: "Signup",
        path: "/signup",
        errorMsg: req.flash('error')
    });
}

exports.postSignup = function (req, res, next) {
    const {
        email,
        password,
        confirmPassword
    } = req.body;
    User.findOne({
        email
    }).then(item => {
        if (item) {
            req.flash('error', "Email already exists!");
            return res.redirect('/signup');
        }
        return bcrypt
            .hash(password, 12)
            .then(hashedPassword => {
                const user = new User({
                    email,
                    password: hashedPassword,
                    cart: {
                        item: []
                    }
                });
                return user.save();
            })
            .then(() => {
                req.flash('error', "Wrong username and/or password!");
                res.redirect('/login')
            })
    })
    .catch(err => console.log(err))
}