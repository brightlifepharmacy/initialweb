const express = require("express");
const router = express.Router();
const Contact = require("../models/contact");

// Render the contact form page
router.get("/contact", (req, res) => {
    res.render("brightlife/contact.ejs");
});

// Handle form submission
router.post("/contact", async (req, res) => {
    try {
        const newContact = new Contact(req.body.contact);
        await newContact.save();
        req.flash("success", "Your message has been sent successfully. We will get back to you shortly.");
        res.redirect("/contact");
    } catch (err) {
        req.flash("error", "There was an error sending your message. Please try again.");
        res.redirect("/contact");
    }
});

module.exports = router;