const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema } = require("../schema.js");
const Listing = require("../models/listing.js");

router.post("/", wrapAsync(async (req, res) => {
    const { error } = listingSchema.validate(req.body);
    if (error) {
      throw new ExpressError(400, error.details.map(el => el.message).join(', '));
    }
  
    const newListing = new Listing(req.body.listing);
    try {
      await newListing.save();
      res.redirect("/listings"); // Or consider sending a success response with the newly created listing details
    } catch (err) {
      console.error(err); // Log the error for debugging
      res.status(err.status || 500).json({ message: "Error creating listing" }); // Send generic error response
    }
  }));


// Index route
router.get("/", (async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index", { allListings });
  }));
  
  // New listing route
  router.get("/new", (req, res) => {
    res.render("listings/new.ejs");
  });
  
  // Show route
  app.get("/:id", wrapAsync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id) .populate("reviews");
    res.render("listings/show.ejs", { listing });
  }));
  
    // Create route
     // Create route
  router.post("/",async (req, res) => {
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
  });
  
  // Edit route
  router.get("/:id/edit", async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing });
  });
  
  // Update route
  router.put("/:id", async (req, res) => {
    const { id } = req.params;
    const updatedData = req.body.listing;
    const listing = await Listing.findById(id);
  
    if (updatedData.image && updatedData.image.url === "") {
      updatedData.image.url = listing.image.url;
    }
  
    await Listing.findByIdAndUpdate(id, updatedData, { new: true });
    res.redirect(`/listings/${id}`);
  });
  
  // Delete route
  router.delete('/:id', async (req, res) => {
    try {
      await Listing.findByIdAndDelete(req.params.id);
      res.redirect('/listings');
    } catch (error) {
      console.error('Error deleting listing:', error);
      res.status(500).send('Server Error');
    }
  }); 
module.exports= router;  