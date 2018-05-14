const Campground = require('../models/campground');
const Comments = require('../models/comment');

const middlewareObj = {
    isLoggedIn : function isLoggedIn(req, res, next){
        if(req.isAuthenticated()){
            req.flash('success', 'Successfully Logged in!')
            return next();
        }
        req.flash('error', 'You need to be logged in to do that');
        res.redirect('/login');
    },

    checkCreateOwership : function checkCreateOwership(req, res, next){
        if (req.isAuthenticated()){
            Campground.findById(req.params.id, (err, foundCampground) =>{
                if (err){
                    req.flash('error', 'Campground not found');
                    res.redirect('/campgrounds');
                } else {
                    if (foundCampground.author.id.equals(req.user._id)){
                        next();
                    } else {
                        req.flash('error', 'You do not permission to do that');
                        res.redirect('back');
                    }
                }
            })
        } else {
            req.flash('error', 'You need to be logged in to do that');
            res.redirect('back');
        }
    },

    checkCommentOwership : function checkCommentOwership(req, res, next){
        if (req.isAuthenticated()){
            Comments.findById(req.params.comment_id, (err, foundComment) =>{
                if (err){
                    res.redirect('/campgrounds')
                } else {
                    if (foundComment.author.id.equals(req.user._id)){
                        next();
                    } else {
                        req.flash('error', 'You do not permission to do that');
                        res.redirect('back');
                    }
                }
            })
        } else {
            req.flash('error', 'You need to be logged in to do that');
            res.redirect('back');
        }
    }
};
//MIDDLEWARE

module.exports = middlewareObj;