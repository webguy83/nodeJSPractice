const http = require('http');
const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const adminData = require('./routes/admin');
const shopRoutes = require('./routes/shop');

const animalRoutes = require('./routes/animal')

const app = express();

app.set("view engine", "pug");
app.set("views","views");

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, "public")));

app.use("/admin", adminData.routes);
app.use(shopRoutes);

/* delete at some point */
app.use('/animals', animalRoutes);
/* delete at some point */
app.use((req, res, next) => {
    res.render('error', {docTitle: "Error and can't be found!"})
    // res.status(404).sendFile(path.join(__dirname, "views", "error404.html"));
})

app.listen(3000);