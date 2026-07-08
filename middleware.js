const Listing = require("./models/listing");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema , reviewSchema } = require("./schema.js");
const Review = require("./models/review.js");



module.exports.isLoggedIn = (req,res,next)=>{
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "you must be logged in ");
        return res.redirect("/login");
    }
    next();
};


// //Route-level middleware :Sirf jis route me pass karoge usi par chalega.
// Yaha isLoggedIn ek normal arrow function hai, lekin kyunki iska signature

//     (req, res, next)

// hai aur ye next() call karta hai, isliye Express ise middleware function ki tarah treat karta hai.
// app.use() kab use hota hai ?
// Jab middleware ko bahut saare routes ya poori application par lagana ho.

module.exports.saveRedirectUrl = (req,res,next)=>{
    if (req.session.redirectUrl){
    req.redirectUrl = req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner = async(req,res,next)=>{
    let { id } = req.params;
    let listing = await Listing.findById(id);
    // console.log(listing);
    if (!listing.owner.equals(res.locals.currUser._id)) {
        req.flash("error", "you don't have permission");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports.validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");//string

        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
}

module.exports.validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");//string

        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
} 


module.exports.isReviewAuthor = async (req, res, next) => {
    let { id , reviewId} = req.params;
    let review = await Review.findById(reviewId);
    
    if (!res.locals.currUser) {
        req.flash("error", "You must be logged in");
        return res.redirect("/login");
    }
    if (!review.author.equals(res.locals.currUser._id)) {
        req.flash("error", "you are not the Author of this Review");
        return res.redirect(`/listings/${id}`);
    }
    next();
}