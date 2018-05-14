const express = require('express');
const router = express.Router();
const Campground = require('../models/campground');
const Comments = require('../models/comment');

const middleware = require('../middleware');

//NEW
router.get('/new', middleware.isLoggedIn, function(req, res){
    res.render('campgrounds/new')
})

//SHOW
router.get('/', function(req, res){
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

router.get('/:id', function(req, res){
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
router.get('/:id/edit', middleware.checkCreateOwership, (req, res) => {
    //is user logged in
    Campground.findById(req.params.id, (err, foundCampground) => {
           res.render('campgrounds/edit', {campground : foundCampground});
    });
})

//UPDATE ROUTE
router.put('/:id',function(req, res){
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updateCampground){
       if(err){
           res.redirect('/campgrounds');
       } else {
           res.redirect('/campgrounds/' + req.params.id);
       }
    })
})

//POST
router.post('/', middleware.isLoggedIn, (req, res) => {
    req.body.campground.description = req.sanitize(req.body.campground.description);
    req.body.campground.author = {
        id : req.user._id,
        username : req.user.username
    }
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
router.delete('/:id', middleware.checkCreateOwership, (req, res) => {
    //destory campground
    Campground.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect('/campgrounds');
        }
        else{
            req.flash('success', 'Campground deleted');
            res.redirect('/campgrounds');
        }
    })
});

module.exports = router;