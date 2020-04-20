var mongoose = require("mongoose"),
    methodOverride = require("method-override");
    express = require("express"),
    bodyParser = require("body-parser"),
    app = express(),
    expressSanitizer = require("express-sanitizer");

mongoose.connect("mongodb://localhost:27017/restful_blog_app", { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressSanitizer());
app.use(express.static("public"));
app.use(methodOverride("_method"));

// mongoose Schema
var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: { type: Date, default: Date.now }
});

var Blog = mongoose.model("Blog", blogSchema);

app.get("/", function (req, res) {
    res.redirect("/blogs");
});

app.get("/blogs", function (req, res) {
    Blog.find({}, function (err, blogs) {
        if (err) {
            console.log("An Error Occured");
        } else {
            res.render("index", { blogs: blogs });
        }
    });
});

app.post("/blogs", function (req, res) {

    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.create(req.body.blog, function (err, Blog) {
        if (err) {
            console.log(err);
        } else {
            res.redirect("/blogs");
        }
    });
});

app.get("/blogs/new", function (req, res) {
    res.render("new");
});

app.get("/blogs/:id", function (req, res) {
    var id = req.params.id;

    Blog.findById(id, function (err, blog) {
        if (err) {
            console.log(err);
        } else {
            res.render("show", { blog: blog });
        }
    });

});

app.get("/blogs/:id/edit", function (req, res) {
    Blog.findById(req.params.id, function (err, blog) {
        if (err) {
            console.log(err);
        } else {
            res.render("edit", { blog: blog });
        }
    });
});

app.put("/blogs/:id", function (req, res) {

    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function (err, blog) {
        if (err) {
            console.log(err);
        } else {
            res.redirect("/blogs/" + req.params.id);
        }
    });
});

app.delete("/blogs/:id", function(req, res){
    Blog.findByIdAndRemove(req.params.id, function(err){
        res.redirect("/blogs");
    });
});

app.listen("8080", "localhost", function () {
    console.log("Blog Server Running");
});
