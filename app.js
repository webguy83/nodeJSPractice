const path = require('path');
// db
const mongoose = require('mongoose');

const express = require('express');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const bodyParser = require('body-parser');


// auth middleware
const authCheck = require('./middlewares/authCheck');

// csrf security
const csrf = require('csurf');

// flash
const flash = require('connect-flash');;

// routes
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');

const User = require('./models/user');

const URI = "mongodb+srv://jankguy83:OFt6ylk6NiMiEN2w@cluster0-lfrbt.mongodb.net/test";

//controllers
const errorController = require('./controllers/error');

// mock pages
const animalRoutes = require('./routes/animal')

const app = express();


const store = new MongoDBStore({
    uri: URI,
    collection: "sessions"
});

const csrfProtection = csrf();
app.use(flash());

app.set("view engine", "ejs");
app.set("views", "views");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use(session({
    secret: "Roody Poo Candy Ass",
    resave: false,
    saveUninitialized: false,
    store: store
}))
app.use(csrfProtection);

app.use((req, res, next) => {
    if (!req.session.user) {
      return next();
    }
    User.findById(req.session.user._id)
      .then(user => {
        req.user = user;
        next();
      })
      .catch(err => console.log(err));
  });

app.use((req, res, next) => {
  res.locals.isAuth = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
});

app.use("/admin", authCheck, adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

// /* delete at some point */
app.use('/animals', animalRoutes);
// /* delete at some point */
app.use(errorController.getErrorPage);

mongoose.connect(URI, { useNewUrlParser: true })
    .then(() => {
        console.log("Mongoose Connected!")
        app.listen(3000);
    })
    .catch(err => console.log(err));
