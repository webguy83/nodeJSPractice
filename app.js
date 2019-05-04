const path = require('path');
// db
const mongoose = require('mongoose');

const express = require('express');
const bodyParser = require('body-parser');

// routes
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

const User = require('./models/user');


//controllers
const errorController = require('./controllers/error');

// mock pages
const animalRoutes = require('./routes/animal')

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
    User.findById("5ccd3096ee58a72080896eac")
        .then(user => {
            req.user = user
            next();
        })
        .catch(err => console.log(err));
})

app.use("/admin", adminRoutes);
app.use(shopRoutes);

// /* delete at some point */
app.use('/animals', animalRoutes);
// /* delete at some point */
app.use(errorController.getErrorPage);

mongoose.connect("mongodb+srv://jankguy83:OFt6ylk6NiMiEN2w@cluster0-lfrbt.mongodb.net/test?retryWrites=true", { useNewUrlParser: true })
    .then(() => {
        console.log("Mongoose Connected!")
        User.findOne()
            .then(user => {
                if (!user) {
                    const user = new User({
                        name: "Bob Faggy",
                        email: "bullnuts@donkey.com",
                        cart: {
                            item: []
                        }
                    });
                    user.save();
                }
            })
            .catch(err => console.log(err))

        app.listen(3000);
    })
    .catch(err => console.log(err));
