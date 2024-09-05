const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
app.use(methodOverride('_method'));
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema } = require("./schema.js");
const Review = require("./models/review.js");
const listings = require("./routes/listing.js");


// Database connection
async function main() {
  await mongoose.connect(MONGO_URL);
}
main()
  .then(() => {
    console.log("Connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

// Setting up view engine and middleware
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate);
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

// Root route
app.get("/", (req, res) => {
  res.send("Hi, I am root");
});

 

app.use("/listings", listings);

  
    
    
    
    
//Review
//postr review Route
app.post("/listings/:id/reviews",async(req,res) => {
  let listing =await Listing.findById(req.params.id);
  let newReview = new Review(req.body.review);

  listing.reviews.push(newReview)

  await newReview.save();
  await listing.save();
 res.redirect(`/listings/${listing._id}`);
 
})
//Delete review route
app.delete("//listings/:id/reviews/:reviewId",(async(req,res)=>{
  let {id,reviewId} =req.params;
  await listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
  await Review.findByIdAndDelete(reviewId);

  res.redirect(`/listings/ ${id}`);
}));

// Handle all other routes (404)
app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page not found"));
});

// Error handling middleware
app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Something went wrong" } = err;
  res.status(statusCode).send(message);
});

// Server listening
app.listen(8080, () => {
  console.log("Server is listening to port 8080");
});
