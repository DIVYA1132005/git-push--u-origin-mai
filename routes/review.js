const express = require("express");
const router = express.Router({mergeParams:true});
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");

//Review
//postr review Route
router.post("/",async(req,res) => {
    let listing =await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
  
    listing.reviews.push(newReview)
  
    await newReview.save();
    await listing.save();
    req.flash("success","New review created!")
    res.redirect(`/listings/${listing._id}`);
})  
  //Delete review route
  // Delete review route
  router.delete("/:reviewId", async (req, res) => {
  let { id, reviewId } = req.params;

  // Pull the review from the listing and delete the review document
  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  req.flash("success","Review deleted!")
  res.redirect(`/listings/${id}`);  // Remove extra space in the redirect URL
});

module.exports=router  