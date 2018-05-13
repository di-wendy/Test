var express = require("express"),
    methodOverride = require("method-override"),
    expressSanitizer = require('express-sanitizer'),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    passport = require("passport"),
    LocalStrategy = require('passport-local'),
    Campground = require("./models/campground"),
    Comments = require("./models/comment"),
    User = require("./models/user"),
    seedDB = require("./seeds");
    
seedDB();

//PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "Once again Rusty wins cutest dog",
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
app.use(methodOverride("_method"));

//CONNECT to mongoose Database
mongoose.connect("mongodb://localhost/yelp_camp");

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    next(); 
    // move to next middleware, router handler
})

//INDEX ROUTE
app.get('/',function(req, res){
    res.render('landing');
})

//NEW
app.get('/campgrounds/new', function(req, res){
    res.render('campgrounds/new')
})

//SHOW
app.get('/campgrounds', function(req, res){
    //Get all campgrounds from DB
    //console.log(req.user);
    Campground.find({}, function(err, Allcampgrounds){
        if(err){
            console.log(err);
        }
        else{
            res.render('campgrounds/campgrounds', {campgrounds:Allcampgrounds,
                                                currentUser:req.user});
        }
    }) 
});

app.get('/campgrounds/:id', function(req, res){
   Campground.findById(req.params.id).populate("comments").exec((err, foundCampground) => {
        if(err){
            res.redirect('/campgrounds');
        }
        else{
            res.render('campgrounds/show', {campground:foundCampground});
        }
   });
})

//EDIT
app.get('/campgrounds/:id/edit', function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
       if(err){
           res.redirect('/campgrounds');
       } else {
           res.render('/campgrounds/edit', {campground : foundCampground});
       }
    })
})

//UPDATE ROUTE
app.put('/campgrounds/:id',function(req, res){
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updateCampground){
       if(err){
           res.redirect('/campgrounds');
       } else {
           res.redirect('/campgrounds/' + req.params.id);
       }
    })
})

//POST
app.post('/campgrounds',function(req, res){
    req.body.campground.description = req.sanitize(req.body.campground.description);
    //Create a new  campground and save to DB
    Campground.create(
        req.body.campground,
        function(err, campground){
            if(err){
                console.log(err)
            } else{
                res.redirect('/campgrounds');
            }
        }
    )
})

// DELTE ROUTE
app.delete('/campgrounds/:id', function(req, res){
    //destory campground
    Campground.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect('/campgrounds');
        }
        else{
            res.redirect('/campgrounds');
        }
    })
});

//=======================
//Comment
//=======================

app.get("/campgrounds/:id/comments/new", isLoggedIn, (req, res) => {
    //find campground by id
    Campground.findById(req.params.id, (err, campground) => {
        if (err){
            console.log(err);
        }
        else{
            res.render("comments/new", {campground:campground});
        }
    })
});

app.post("/campgrounds/:id/comments", isLoggedIn, (req, res) => {
    Campground.findById(req.params.id, (err, campground) => {
        if (err){
            console.log(err);
            redirect("/campgrounds");
        }
        else{
            Comments.create(req.body.comment, (err, comment) => {
                if(err){
                    console.log(err);
                } else {
                    campground.comments.push(comment);
                    campground.save();
                    res.redirect('/campgrounds/' + campground._id);
                }
            })
        }
    })
})

//=======================
//Auth Routes
//=======================
app.get('/register', (req, res) =>{
    res.render('register');
})

//handle sign up info
app.post('/register', (req, res) => {
    var newUser = new User({username:req.body.username});
    User.register(newUser, req.body.password, (err, user) => {
        if(err){
            console.log(err);
            return res.render('register');
        }
        passport.authenticate('local')(req, res, function(){
            res.redirect('/campgrounds');
        })
    });
})

//Show login info
app.get('/login', (req, res) => {
    res.render('login')
})

//with middleware
app.post('/login', passport.authenticate('local',
    {
        successRedirect: '/campgrounds',
        failureRedirect: '/login'
    }), (req, res) =>{

    }
)

//log out route
app.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/campgrounds');
})

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/login');
}

app.listen(3000,function(){
    console.log('listening');
});