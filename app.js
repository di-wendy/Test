const express = require("express"),
    methodOverride = require("method-override"),
    expressSanitizer = require('express-sanitizer'),
    app = express(),
    bodyParser = require("body-parser"),
    flash = require("connect-flash"),
    mongoose = require("mongoose"),
    passport = require("passport"),
    LocalStrategy = require('passport-local'),
    Campground = require("./models/campground"),
    Comments = require("./models/comment"),
    User = require("./models/user"),
    seedDB = require("./seeds");

const commentsRoutes = require('./routes/comments'),
    campgroundsRoutes = require('./routes/campgrounds'),
    indexRoutes = require('./routes/index')

app.use(flash());

//PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: 'Once again Rusty wins cutest dog',
    resave: false,
    saveUnitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
app.set('view engine','ejs');
app.use(express.static(__dirname + '/public'));

//seedDB();

app.use(methodOverride('_method'));

//CONNECT to mongoose Database
mongoose.connect("mongodb://localhost/yelp_camp");

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash('error');
    res.locals.success = req.flash('success');
    next();
    // move to next middleware, router handler
})

app.use(indexRoutes);
app.use('/campgrounds', campgroundsRoutes);
app.use('/campgrounds/:id/comments', commentsRoutes);

app.listen(3000,function(){
    console.log('listening');
});