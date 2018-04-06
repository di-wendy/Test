var express = require("express");
var app = express();
var bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({extended: true}));

app.set('view engine','ejs');

var grounds = [
    {name:'wendy', image:'https://www.gstatic.com/webp/gallery/4.sm.webp', },
    {name:'Hao', image:'https://www.gstatic.com/webp/gallery/4.sm.webp'}
]

//GET
app.get('/',function(req, res){
    res.render('landing');
})

app.get('/campgrounds/new', function(req, res){
    res.render('new')
})

app.get('/campgrounds', function(req, res){
    res.render('campgrounds',{campgrounds:grounds});
});

//POST
app.post('/campgrounds',function(req, res){
    var name = req.body.name;
    var image = req.body.image;
    var newCamp = {name: name, image: image}
    grounds.push(newCamp);
    res.redirect('/campgrounds');
})

app.listen(3000,function(){
    console.log('listening');
});