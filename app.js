var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/yelp_camp");

app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine','ejs');

//SCHEMA SETUP
var campgroundSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String
})

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
app.get('/campgrounds/:id', function(req, res){
   Campground.findById(req.param.id, function(err, foundCampground){
        if(err){
            console.log(err)
        }
        else{
            req.params.id
            res.render('show', {campground:foundCampground});
        }
   });
})

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

//POST
app.post('/campgrounds',function(req, res){
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var newCamp = {name: name, image: image, description:desc};
    //Create a new  campground and save to DB
    Campground.create(
        newCamp,
        function(err, campground){
            if(err){
                console.log(err)
            } else{
                res.redirect('/campgrounds');
            }
        }
    )
})

app.listen(3000,function(){
    console.log('listening');
});