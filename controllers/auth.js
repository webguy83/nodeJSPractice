const User = require("../models/user");
const bcrypt = require('bcrypt');
const crypto = require('crypto');

const nodemailer = require('nodemailer');
const sendgridTrans = require('nodemailer-sendgrid-transport');

const transporter = nodemailer.createTransport(sendgridTrans({
    auth: {
        api_user: "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"
    }
}));

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
                res.redirect('/login');
                return transporter.sendMail({
                    to: email,
                    from: "fuckenstore@dunce.com",
                    subject: "Signup is done! Enjoy your email.",
                    html: "<h1>Eat rocks and enjoy your sign up!</h1>"
                });
            })
    })
    .catch(err => console.log(err))
}

exports.getReset = function (req, res, next) {
    res.render('auth/reset', {
        docTitle: "Reset Password",
        path: "/reset",
        errorMsg: req.flash('error')
    });
}

exports.postReset = (req, res, next) => {
    crypto.randomBytes(32, (err, buffer) => {
        if(err) {
            console.log(err);
            return res.redirect('/reset');
        }
        const token = buffer.toString('hex');
        User.findOne({email: req.body.email})
        .then(user => {
            if(!user) {
                req.flash('error', "No account is found with this email can be located!");
                return res.redirect('/reset');
            }
            user.resetToken = token;
            user.resetTokenExpiration = Date.now() + 3600000;
            return user.save();
        })
        .then(() => {
            res.redirect('/');
            transporter.sendMail({
                to: req.body.email,
                from: "fuckenstore@dunce.com",
                subject: "Password Reset!",
                html: `
                    <p>You wanted your password reset? Okay.<p/>
                    <p>Click here <a href="http://localhost:3000/reset/${token}">link</a> to set a new password bizatch.<p/>
                `
            });
        })
        .catch(err => console.log(err));
    })
}

exports.getNewPassword = (req, res, next) => {
    const token = req.params.token;
    User.findOne({
        resetToken: token,
        resetTokenExpiration: {
            $gt: Date.now()
        }})
        .then(user => {
            res.render('auth/new-password', {
                docTitle: "New Password",
                path: "/new-password",
                errorMsg: req.flash('error'),
                userId: user._id.toString(),
                passwordToken: token
            });
        })
        .catch(err => console.log(err))
}

exports.postNewPassword = (req, res, next) => {
    const newPassword = req.body.password;
    const userId = req.body.userId;
    const passwordToken = req.body.passwordToken;
    let newResetUser;

    User.findOne({
        resetToken: passwordToken,
        resetTokenExpiration: {
            $gt: Date.now()
        }
    })
    .then(user => {
        newResetUser = user;
        return bcrypt.hash(newPassword, 12);
    })
    .then(hashedPassword => {
        newResetUser.password = hashedPassword;
        newResetUser.resetToken = undefined;
        newResetUser.resetTokenExpiration = undefined;
        return newResetUser.save();
    })
    .then(() => {
        res.redirect('/login');
    })
    .catch(err => console.log(err));
}