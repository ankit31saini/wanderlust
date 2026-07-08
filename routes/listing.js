const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");

const multer = require('multer')
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage })
// const upload = multer({ dest: 'uploads/' })


const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");

const { index, renderNewForm, showListing,
    renderEditForm, updateListing, createListing, destroyListing } = require("../controllers/listings.js");

router.route("/")
    .get(wrapAsync(index))
    .post(isLoggedIn, upload.single("listing[image][url]"), validateListing, wrapAsync(createListing));
    

//new route  //we place new route before show route because if we place it after show route 
// then it will consider new as id and will not work
router.get("/new", isLoggedIn, renderNewForm);


router.route("/:id")
    .get(wrapAsync(showListing))
    .delete(isLoggedIn, isOwner, wrapAsync(destroyListing));

router.route("/:id/edit")
    .get(isLoggedIn, isOwner, wrapAsync(renderEditForm))
    .put(isLoggedIn, isOwner, upload.single("listing[image][url]"), validateListing, wrapAsync(updateListing));
    

//index route
// router.get("/", wrapAsync(index));

//new route  //we place new route before show route because if we place it after show route 
// then it will consider new as id and will not work
// router.get("/new", isLoggedIn, renderNewForm);

//create route
// router.post("/", isLoggedIn, validateListing, wrapAsync(createListing));


//show route
// router.get("/:id", wrapAsync(showListing));

//edit route
// router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(renderEditForm));

//update route
// router.put("/:id/edit", isLoggedIn, isOwner, validateListing, wrapAsync(updateListing));

//DELETE ROUTE
// router.delete("/:id", isLoggedIn,isOwner, wrapAsync(destroyListing));

module.exports = router;