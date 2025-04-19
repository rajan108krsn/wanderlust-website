const express = require("express");
const app = express();
const users = require("./routes/user.js");
const posts = require("./routes/post.js");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const flash = require("connect-flash");
const path = require("path");

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
const sessionOptions =
    {
        secret: "mysupersecretstring", resave: false, saveUninitialized: true
    };

app.use(session(sessionOptions));
app.use(flash());
app.use((req,res,next)=>{
    res.locals.successMsg = req.flash("success");
    res.locals.errorMsg = req.flash("error");
    next();
})
app.get("/register",(req,res)=>{
    let {name="anonymous"} = req.query;
    req.session.name = name;
    if(name === "anonymous")
    req.flash("error", "user not registered");
    else 
    req.flash("success", "user registered succesfully");

    res.redirect('/hello');
})
app.get("/test",(req,res)=>{
    res.send("test successful.");
})
app.get("/hello",(req,res)=>{
    res.render("page.ejs",{name: req.session.name});
})
app.get("/reqcount",(req,res)=>{
    if(req.session.count)
        req.session.count++;
    else
        req.session.count = 1;
    res.send(`You sent request ${req.session.count} times.`);
})
// app.use(cookieParser("secretcode"));

// app.get("/getsignedcookie", (req,res)=>{
//     res.cookie("made-in", "Vrindavan", {signed: true});
//     res.send("signed cookie sent");
// })


// app.get("/", (req, res) => {
//     console.log(req.cookies);
//     res.send("Hi, I am root.");
// });
// app.get("/verify",(req,res)=>{
//     console.log(req.cookies);
//     res.send("verified");
// })

// app.get("/greet", (req,res)=>{
//     let {name="anonymous"} = req.cookies;
//     res.send(`Radhe radhe ${name}.`);
// })

// app.get("/getcookies",(req,res)=>{
//     res.cookie("greet", "Radhe Radhe");
//     res.cookie("bolo", "hare krsn");
//     res.send("sent you some cookies...");
// })


// app.use("/users", users);
// app.use("/post", posts);

// Start Server
app.listen(8080, () => {
    console.log("Server is running on port 8080...");
});
