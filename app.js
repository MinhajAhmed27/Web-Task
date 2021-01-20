var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var passport = require('passport');

var session = require("express-session")
var LocalStrategy = require("passport-local")
var passportLocalMongoose = require('passport-local-mongoose')
var product = require("./models/product");
var customer = require("./models/customer");
const { authenticate } = require('passport');
var lat ="";
var lon = "";
mongoose.connect('mongodb://localhost/customerDB',{
    useNewUrlParser:true,
    useUnifiedTopology: true
});

var app = express();
app.set("view engine","ejs"); 
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json())
app.use(session({
    secret:"qwerty",
    resave:false,
    saveUninitialized:false
}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(customer.authenticate()));
//passport.use(customer.createStrategy());
passport.serializeUser(customer.serializeUser());
passport.deserializeUser(customer.deserializeUser());

app.get("/",(req,res)=>{
    res.render("login");

    customer.find({},(err,cust)=>{
        if(err){
            console.log('error in find()')
        }else{
            console.log("All ccustomers ...")
            console.log(cust)
        }
    });
});

//secret page is made to test the authentication and session
// it also contain logout functionality
app.get("/secret",checkAuth,(req,res)=>{
    res.render("secret");
});

app.get("/register",(req,res)=>{
    res.render("register");

});

app.get("/map",checkAuth,(req,res)=>{
    
    res.redirect("http://www.google.com/maps/search/restaurant/@"+lat+","+lon+",14z")

});

app.get("/login",(req,res)=>{
    res.render("login");

});

app.get("/logout",(req,res)=>{
    req.logout();
    res.redirect("/");
});

app.post("/login",passport.authenticate("local",{
    //successRedirect:"/home",  this is for testing

    successRedirect:"/map",
    failureRedirect:"/login"
}),function(req,res){

});

app.post("/register",(req,res)=>{

    console.log("req.body -> "+JSON.stringify(req.body))

    var username = req.body.username;
    var password = req.body.password;
    
    var latitude = req.body.latitude;
    var longitude = req.body.longitude;

    console.log("name password "+username +password)
    console.log("latitude longitude "+latitude +longitude)

    lat = latitude;
    lon = longitude;
    //var newCustomer = JSON.stringify({ name:name,email:email }) 

    customer.register(new customer({username:username}),password,function(err,cust){
        if(err){
            console.log(err)
            return res.render('register')
        }
        passport.authenticate("local")(req,res,function(){
            
            // to map
            res.redirect("/map")
            //res.redirect("/secret")

            

        });
    });
});

function checkAuth(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

app.listen(3000,function(){
    console.log("Server Started")
});