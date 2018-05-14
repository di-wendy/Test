
const express = require('express');
const router = express.Router({mergeParams:true});
const Campground = require('../models/campground');
const Comments = require('../models/comment');

const middleware = require('../middleware');

//GET NEW
router.get("/new", middleware.isLoggedIn, (req, res) => {
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

//COMMENT CREATE
router.post('/', middleware.isLoggedIn, (req, res) => {
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
                    //add username and id to comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    //save comment
                    campground.comments.push(comment);
                    campground.save();
                    req.flash('success', 'Successfully added comment');
                    res.redirect('/campgrounds/' + campground._id);
                }
            })
        }
    })
})

//EDIT
router.get('/:comment_id/edit', middleware.checkCommentOwership, (req, res) =>{
    Comments.findById(req.params.comment_id, (err, foundComment) => {
        if (err){
            res.redirect('back');
        } else {
            res.render('comments/edit', {campground_id:req.params.id,
                                         comment: foundComment})
        }
    })
})

//UPDATE
router.put('/:comment_id', (req, res) => {
    Comments.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, updateComment) =>{
        if (err){
            res.redirect('back');
        } else {
            res.redirect('/campgrounds/' + req.params.id);
        }
    })
})

router.delete('/:comment_id', middleware.checkCommentOwership, (req, res) => {
    //findbyidandremove
    Comments.findByIdAndRemove(req.params.comment_id, (err) => {
        if (err){
            res.redirect('back');
        } else {
            req.flash('success', 'Comment deleted');
            res.redirect('/campgrounds/' + req.params.id);
        }
    })
})

module.exports = router;