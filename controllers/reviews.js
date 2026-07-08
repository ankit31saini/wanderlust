const Listing = require("../models/listing.js");
const Review = require("../models/review.js");

module.exports.createReview = async (req, res) => {
    let updatedlisting = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    updatedlisting.review.push(newReview);

    await newReview.save();
    await updatedlisting.save();

    console.log("review saved successfully");
    req.flash("success", "New Review Created");
    res.redirect(`/listings/${req.params.id}`);
}

module.exports.destroyReview = async (req, res) => { //we removed "/listings/:id/review" 
    let { id, reviewId } = req.params;
    await Review.findByIdAndDelete(reviewId);
    await Listing.findByIdAndUpdate(id, { $pull: { review: reviewId } });

    req.flash("success", "Review Deleted");
    res.redirect(`/listings/${id}`);
}