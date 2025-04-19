const express = require("express");
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync');
const { listingSchema } = require("../schema.js");
const ExpressError = require('../utils/ExpressError');
const Listing = require('../models/listing');
const mongoose = require('mongoose');
const {isLoggedIn,saveRedirectUrl} = require("../middleware.js")

// Middleware for validating request body
const validateListing = (req, res, next) => {
    const { error } = listingSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(', ');
        req.flash('error', msg);
        throw new ExpressError(400, msg);
    } else {
        next();
    }
};

// Middleware for validating MongoDB Object IDs
const validateObjectId = (req, res, next) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ExpressError(400, "Invalid listing ID");
    }
    next();
};

// Index - Get all listings
router.get('/', wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index", { allListings });
}));

// New - Form to create new listing
router.get('/new', isLoggedIn,(req, res) => {
    res.render("listings/new");
});

// Show - Get single listing
router.get('/:id', validateObjectId, wrapAsync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews").populate("owner");
    if (!listing) {
        req.flash("error", "Listing not found");
        return res.redirect("/listings");
    }
    res.render("listings/show", { listing });
}));

// Create - Post new listing
router.post('/', validateListing, wrapAsync(async (req, res) => {
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    req.flash("success", "New Listing Created!");
    res.redirect(`/listings/${newListing._id}`);
}));

// Edit - Form to edit listing
router.get('/:id/edit', saveRedirectUrl, isLoggedIn, validateObjectId, wrapAsync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        throw new ExpressError(404, "Listing not found");
    }
    res.render("listings/edit", { listing });
}));

// Update - PUT updated listing
router.put('/:id',isLoggedIn, validateObjectId, validateListing, wrapAsync(async (req, res) => {
    const { id } = req.params;
    const updatedListing = await Listing.findByIdAndUpdate(
        id,
        req.body.listing,
        { new: true, runValidators: true }
    );
    if (!updatedListing) {
        throw new ExpressError(404, "Listing not found");
    }
    req.flash("success", "Listing Updated Successfully!");
    res.redirect(`/listings/${id}`);
}));

// Delete - Destroy listing
router.delete('/:id', isLoggedIn,validateObjectId, wrapAsync(async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted Successfully!");
    res.redirect('/listings');
}));

module.exports = router;