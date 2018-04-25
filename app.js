var express = require("express"),
    methodOverride = require("method-override"),
    expressSanitizer = require('express-sanitizer'),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose");

app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
app.set('view engine','ejs');
app.use(methodOverride("_method"));

//CONNECT to mongoose Database
mongoose.connect("mongodb://localhost/yelp_camp");

//SCHEMA SETUP
var campgroundSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String
})

//CREATE MODEL
var Campground = mongoose.model("Campground", campgroundSchema);

//INDEX ROUTE
app.get('/',function(req, res){
    res.render('landing');
})

//NEW
app.get('/campgrounds/new', function(req, res){
    res.render('new')
})

//SHOW - show more info
app.get('/campgrounds', function(req, res){
    //Get all campgrounds from DB
    Campground.find({}, function(err, Allcampgrounds){
        if(err){
            console.log(err);
        }
        else{
            res.render('campgrounds',{campgrounds:Allcampgrounds});
        }
    }) 
});

app.get('/campgrounds/:id', function(req, res){
   Campground.findById(req.params.id, function(err, foundCampground){
        if(err){
            res.redirect('/campgrounds');
        }
        else{
            res.render('show', {campground:foundCampground});
        }
   });
})

//EDIT
app.get('/campgrounds/:id/edit', function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
       if(err){
           res.redirect('/campgrounds');
       } else {
           res.render('edit', {campground : foundCampground});
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

app.listen(3000,function(){
    console.log('listening');
});