const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/user');

const middleware = require('../middleware');

//INDEX ROUTE
router.get('/',function(req, res){
    res.render('landing');
})

//GET REGISTER ROUTE
router.get('/register', (req, res) =>{
    res.render('register');
})

//handle sign up info
router.post('/register', (req, res) => {
    var newUser = new User({username:req.body.username});
    User.register(newUser, req.body.password, (err, user) => {
        if(err){
            req.flash('error', err.message);
            return res.render('register');
        }
        passport.authenticate('local')(req, res, function(){
            req.flash('success', 'Welcome to Yelpcamp ' + user.username);
            res.redirect('/campgrounds');
        })
    });
})

//Show login info
router.get('/login', (req, res) => {
    res.render('login');
})

//with middleware
router.post('/login', passport.authenticate('local',
    {
        successRedirect: '/campgrounds',
        failureRedirect: '/login'
    }), (req, res) =>{
        if(err){
            req.flash('error', err.message);
        }
        else{
            req.flash('success', 'Welcome to Yelpcamp ' + user.username);
        }
    }
)
//log out route
router.get('/logout', (req, res) => {
    req.logout();
    req.flash('error','Logged you out');
    res.redirect('/campgrounds');
})

module.exports = router;

