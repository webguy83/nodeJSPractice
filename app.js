const http = require('http');
const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

//db
const sequelize = require("./utils/database");

//controllers
const errorController = require('./controllers/error');

// mock pages
const animalRoutes = require('./routes/animal')

const app = express();

app.set("view engine", "ejs");
app.set("views","views");

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, "public")));

app.use("/admin", adminRoutes);
app.use(shopRoutes);

/* delete at some point */
app.use('/animals', animalRoutes);
/* delete at some point */
app.use(errorController.getErrorPage);

sequelize
    .sync()
    .then(result => {
        //console.log(result);
        app.listen(3000);
    })
    .catch(err => {
        console.log(err);
    });