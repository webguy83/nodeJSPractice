const http = require('http');
const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

const animalRoutes = require('./routes/animal')

const app = express();

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, "public")));

app.use("/admin", adminRoutes);
app.use(shopRoutes);

/* delete at some point */
app.use('/animals', animalRoutes);
/* delete at some point */
app.use((req, res, next) => {
    res.status(404).sendFile(path.join(__dirname, "views", "error404.html"));
})

app.listen(3000);