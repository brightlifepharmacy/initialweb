const express = require("express");
const router = express.Router();
const Blog = require("../models/blog");
const Comment = require("../models/comment");
const { isLoggedIn } = require("../middleware.js");

// GET: Base route will now automatically be '/blogs'
router.get("/", async (req, res, next) => {
    try {
        const blogs = await Blog.find({});
        res.render("blogs/index.ejs", { blogs });
    } catch (err) {
        next(err);
    }
});

// GET: Route will automatically be '/blogs/:id'
router.get("/:id", async (req, res, next) => {
    try {
        const blog = await Blog.findById(req.params.id).populate({
            path: "comments",
            populate: {
                path: "author"
            }
        });

        if (!blog) {
            req.flash("error", "The requested blog post could not be found.");
            return res.redirect("/blogs");
        }

        res.render("brightlife/blogs/show.ejs", { blog });
    } catch (err) {
        next(err);
    }
});

// POST: Route will automatically be '/blogs/:id/comments'
router.post("/:id/comments", isLoggedIn, async (req, res, next) => {
    try {
        const blog = await Blog.findById(req.params.id);
        
        if (!blog) {
            req.flash("error", "Blog not found. Cannot add comment.");
            return res.redirect("/blogs");
        }

        const comment = new Comment(req.body.comment);
        comment.author = req.user._id;
        
        blog.comments.push(comment);
        await comment.save();
        await blog.save();
        
        req.flash("success", "Your comment has been published successfully.");
        res.redirect(`/blogs/${blog._id}`);
    } catch (err) {
        req.flash("error", "An error occurred while posting your comment. Please try again.");
        res.redirect(`/blogs/${req.params.id}`);
    }
});

module.exports = router;