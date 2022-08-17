const dotenv = require('dotenv').config();  //configures our .env file
const express = require("express"); // creates our app
const session = require("express-session");  // helps to creates a session middleware
const MongoStore = require("connect-mongo");  // helps to store sessions in database   don't use (session) it is giving an error
const mongoose = require("mongoose");   // helps to connect with mongodb Data base
const bodyParser = require("body-parser");
const ejs = require("ejs");   // to help deliver ejs files
const bcrypt = require("bcrypt");

const app = express();

mongoose.connect("mongodb://localhost:27017/userAuth_DB",{
    useNewUrlParser:true,
    useUnifiedTopology:true
})
.then(function(){
    console.log("MongoDB connected successfully");
});


const sessionStore = {
    mongoUrl: "mongodb://localhost:27017/userAuth_DB",
    collectionName : 'sessions'
}
// middlewares
app.use(session({
    secret: process.env.SECRET,
    resave:false,
    saveUninitialized:false,
    store : MongoStore.create(sessionStore)
}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");

const userSchema = new mongoose.Schema({
    fname: String,
    lname: String,
    email: String,
    password:String
});

const User = mongoose.model("User",userSchema);

app.get("/", function(req,res){
    res.render("home");
});
app.get("/login", function(req,res){
    res.render("login");
});
app.get("/registration", function(req,res){
    res.render("registration");
});
app.get("/secret",function(req,res){
    if(req.session.isAuth === true){
        res.render("secret");
    }else{
        res.render("login");
    }
});
app.post("/login", async function(req,res){
    const userEmail = req.body.email ;
    const userPassword = req.body.psw ;
       User.findOne({email:userEmail},function(err,foundUser){
           if(err){
             console.log(err);
           }else{
            bcrypt.compare(userPassword, foundUser.password , function(error, passwordConfirmed){
                if(passwordConfirmed === true){
                    req.session.isAuth = true ;
                    res.redirect("/secret");
                 }else{
                    res.redirect("/login");
                 }
            });
           }
       });
});
app.post("/registration", async function(req,res){
    let newUser = await User.findOne({email:req.body.email});  //this will help to prevent multiple feature with the same mail id
    if(newUser){
        const messageString = "<h1>This user with same mail_ID already exists. Please try another one.</h1>" ;
        const regis_LinkUUrl = "/registration" ;
        const login = "/login" ;
        const combinedUrl = "<a href="+regis_LinkUUrl +"> Registration </a>"+ "Or" +
                             "<a href="+ login +"> Login </a>"
        res.send(messageString + combinedUrl);
    }else{
    const hashedPassword = await bcrypt.hash(req.body.confirmpsw , 10) ;
    newUser = new User({
        fname: req.body.fname,
        lname: req.body.lname,
        email: req.body.email,
        password: hashedPassword
     }); 
    newUser.save(function(err,savedUser){
        if(err){
            console.log(err);
        }else{
           req.session.isAuth = true ;
           res.redirect("/secret");
        }
    });
    }
});
app.post("/logout", function(req,res){
    req.session.destroy(function(err){
        if(err){
            console.log(err)
        }else{
            res.redirect("/");
        }
    })
});


app.listen(4000, function(){
    console.log("Server started in 4000 port");
})