const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const flash = require("connect-flash");
const passport = require("passport");

router.get("/signup",(req,res)=>{
    res.render("users/signup.ejs"); 
})
router.post("/signup", async(req,res)=>{
    let{username,email,password}=req.body;
    const newUser = new User ({email,username});
    const registeredUser = await User.register(newUser,password);
    req.flash("succes","Welcome to Wendrelust");
    res.redirect("/listings");
});
router.get("/login",(req,res) => {
    res.render("users/login.ejs"); 
});
router.post("/login", passport.authenticate("local",{failureRedirect:"/login",failureFlash:true }),
async(req,ras)=>{
res.send("Welcome to Wanderlust! You are logged in!")
})


module.exports=router;