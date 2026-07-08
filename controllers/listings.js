const Listing = require("../models/listing.js");



module.exports.index =  async (req, res) => {
    const allListing = await Listing.find({});
    res.render("listings/index.ejs", { allListing });

}

module.exports.renderNewForm =  (req, res) => {
    // console.log(req.user);   //request object  has user property which is added by passport after successful login and it contains the user data
    
    res.render("listings/new.ejs");
}

module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    const listings = await Listing.findById(id).populate({path:"review",populate:{path:"author"}}).populate("owner");
    if(!listings){
        req.flash("error","listing you requested for is not exist");
        res.redirect("/listings");
    }else{

        //--temporary work, bcz our existing listings do not had geometry details
        let location = `${listings.location}, ${listings.country}`;
        console.log(location);

        let response = await fetch(
            `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(location)}&format=json&limit=1`,
            {
                headers: {
                    "User-Agent": "MajorProject/1.0"
                }
            }
        );


        let data = await response.json();
        console.log(data);
        console.log(listings.geometry);
        listings.geometry = {
            type: "Point",

            coordinates: [
                Number(data[0].lon),
                Number(data[0].lat)
            ]
        }
        await listings.save();
        //--
        
    res.render("listings/show.ejs", { listings });
    }
}

module.exports.renderEditForm  = async (req, res) => {
    let { id } = req.params;
    const listings = await Listing.findById(id);
    if (!listings) {
        req.flash("error", "listing you requested for is not exist");
        res.redirect("/listings");
    }else{
    let originalImageUrl = listings.image.url;    
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250");
        res.render("listings/edit.ejs", { listings, originalImageUrl });
    }
}

module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
    
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

    if(typeof req.file !== "undefined"){
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = {url,filename};
    await listing.save();
    }
    req.flash("success", "Listing Updated");
    res.redirect(`/listings/${id}`);
}

module.exports.createListing = async (req, res) => {
    // try{
    // let {title,description,image,price, location,country} = req.body;
    // let listing = req.body.listing;

    // if (!req.body.listing){
    //     throw new ExpressError(400,"send valid data for listing");
    // }

    let location = `${req.body.listing.location}, ${req.body.listing.country}`;
    console.log(location);
    
    let response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(location)}&format=json&limit=1`,
        {
            headers: {
                "User-Agent": "MajorProject/1.0"
            }
        }
    );


    let data = await response.json();
    console.log(data);
    

    let url = req.file.path;
    let filename = req.file.filename;
    
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = {url,filename};

    newListing.geometry = {
        type: "Point",

        coordinates: [
            Number(data[0].lon),
            Number(data[0].lat)
        ]
    }

    await newListing.save();
    // console.log(req.body.listing);
    req.flash("success","New Listing Created");
    res.redirect("/listings");

    // }catch(err){
    //     next(err);
    // }
}


module.exports.destroyListing = async (req, res) => {
    let { id } = req.params;
    let deleteListing = await Listing.findByIdAndDelete(id);
    console.log(deleteListing);
    req.flash("success", "Listing Deleted successfully");
    res.redirect("/listings");
}