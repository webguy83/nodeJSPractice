const http = require('http');
const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
// const expressHbs = require('express-handlebars');
const adminData = require('./routes/admin');
const shopRoutes = require('./routes/shop');

const animalRoutes = require('./routes/animal')

const app = express();

// app.engine('hbs', expressHbs({
//     defaultLayout: "main-layout",
//     extname: "hbs"
// }));

app.set("view engine", "ejs");
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