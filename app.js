const dotenv = require('dotenv').config();
const express = require("express");
const session = require("express-session");  // helps to creates a session middleware
const MongoStore = require("connect-mongo");  // helps to store sessions in database   don't use (session) it is giving an error
const mongoose = require("mongoose");   // helps to connect with mongodb Data base

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

app.use(session({
    secret: process.env.SECRET,
    resave:false,
    saveUninitialized:false,
    store : MongoStore.create(sessionStore)
}))




app.get("/", function(req,res){
    req.session.isAuth = true ;
    console.log(req.session);
    console.log(req.session.id);
    res.send("Hello and welcome world!");
});



app.listen(4000, function(){
    console.log("Server started in 4000 port");
})