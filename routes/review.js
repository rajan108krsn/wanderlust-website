const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require('../utils/wrapAsync'); 
const { reviewSchema } = require("../schema.js");
const ExpressError = require('../utils/ExpressError');
const Listing = require('../models/listing');
const Review = require("../models/review");

const validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    if (error) {
        throw new ExpressError(400, error.details.map(el => el.message).join(', ')); // Extract error message
    }
    next();
};

// Add a review to a listing
router.post("/", validateReview, wrapAsync(async (req, res) => {
    const { id } = req.params;

    if (!id || id.length !== 24) {
        throw new ExpressError(400, "Invalid listing ID.");
    }

    let listing = await Listing.findById(id);
    if (!listing) {
        throw new ExpressError(404, "Listing not found.");
    }

    let newReview = new Review(req.body.review);
    await newReview.save();
    listing.reviews.push(newReview); 
    await listing.save();

    res.redirect(`/listings/${listing._id}`);
}));

// Delete review from a listing
router.delete("/:reviewId", wrapAsync(async (req, res) => {
    const { id, reviewId } = req.params;

    if (!id || id.length !== 24 || !reviewId || reviewId.length !== 24) {
        throw new ExpressError(400, "Invalid ID.");
    }

    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId); // Ensure review is removed

    res.redirect(`/listings/${id}`);
}));

module.exports = router;
