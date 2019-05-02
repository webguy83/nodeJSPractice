const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

const User = require('./models/user');

//db
const mongoConnect = require("./utils/database").mongoConnect;

//controllers
const errorController = require('./controllers/error');

// mock pages
const animalRoutes = require('./routes/animal')

const app = express();

app.set("view engine", "ejs");
app.set("views","views");

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
    User.findById("5cc964f2a4185b15b4d298b5")
        .then(user => {
            req.user = new User(user.name, user.email, user.cart, user._id)
            next();
        })
        .catch(err => console.log(err));
})

app.use("/admin", adminRoutes);
app.use(shopRoutes);

/* delete at some point */
app.use('/animals', animalRoutes);
/* delete at some point */
app.use(errorController.getErrorPage);

mongoConnect(() => {
    app.listen(3000);
})

