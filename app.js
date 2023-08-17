require('dotenv').config();
const express = require("express");
const bodyParser=require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt=require("mongoose-encryption");

const app = express();

app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true}));

mongoose.connect("mongodb://127.0.0.1:27017/userDB");

const userSchema=new mongoose.Schema({
    email:String,
    password:String
});

const secret=process.env.SECRET;
userSchema.plugin(encrypt, {secret:secret, encryptedFields:["password"] });
// userSchema.plugin(encrypt, {secret:secret, encryptedFields:["password"] });

const User=new mongoose.model("User" ,userSchema);

// console.log();

app.get('/', (req, res) =>{
    res.render('home');
});

app.get('/login', (req, res) =>{
    res.render('login');
});

app.post('/login', async (req, res) =>{
    const username = req.body.username;
    const password = req.body.password;

    const x=await User.findOne({ email: username});
    if(x!=null && x.password==password){
        console.log("Your are logged in successfully");
    }else{
        console.log("enter the correct username and password");
    }
    
});

app.get('/register', (req, res) =>{
    res.render('register');
});


app.post('/register', (req, res) =>{
    const newUser= new User( { 
    email:req.body.username,
    password:req.body.password
    });

    newUser.save();

})



app.get('/secrets', (req, res) =>{
    res.render('secrets');
});

app.listen(3000,function(req,res) {
        console.log("3000 port par server chalat ba bina kawano dikkat ke");
    });
