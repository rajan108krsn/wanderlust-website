const express = require('express');
const mongoose = require('mongoose');
const app = express();
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const list = require("./routes/listing.js");
const rev = require('./routes/review.js');
const user = require('./routes/user.js');

const session = require("express-session");
const flash = require("connect-flash");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const passport = require("passport");

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

const sessionOptions = {
    secret :"mysupersecretcode",
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge:  7 * 24 * 60 * 60 * 1000,
        httpOnly: true
    }
}

app.use(session(sessionOptions));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.engine('ejs', ejsMate);
app.use(express.json());
app.use(methodOverride('_method'));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static('public'));
app.use(express.static(path.join(__dirname, "/public")));
app.use(express.urlencoded({ extended: true }));


app.use(flash());
app.use((req,res,next)=>{
    res.locals.messages = req.flash();
    res.locals.currUser = req.user;
    next();
})
app.use("/listings", list);
app.use("/listings/:id/reviews",rev);
app.use("/",user); 


const URL = 'mongodb://localhost:27017/airbnb';
main()
    .then(() => console.log('MongoDB connected...'))
    .catch(err => console.log(err));

async function main() {
    await mongoose.connect(URL);
}



// Home route
// const Listing = require('./models/listing');

app.get('/', (_, res) => {
    res.render("listings/png");
});

app.get("/demouser", async(req,res)=>{
    let fakeUser = new User({
        email: "student@gmail.com",
        username: "delta-student"
    });
    let registeredUser = await User.register(fakeUser, "helloworld");
    res.send(registeredUser);
})
// Handle 404 errors
app.all("*", (req, res, next) => {
    next(new ExpressError('Page Not Found', 404));
});

// // Global error handler
// app.use((err, req, res, next) => {
//     let { status = 500, message = "Something went wrong" } = err;
//     res.render("listings/error", { message, status });
// });

// Start server
app.listen(3000, () => {
    console.log('Server is running...');
});
