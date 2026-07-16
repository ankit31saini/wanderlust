# MAJORPROJECT

A full-stack Express.js travel listing web application inspired by a Wanderlust-style marketplace. Users can browse destinations, add new listings, update or delete their own listings, sign up or log in, and leave reviews.

## Features

- Browse all travel listings
- Create, edit, and delete listings
- User authentication with Passport.js
- Role-based ownership checks for listing edits/deletes
- Reviews and ratings for each listing
- Cloudinary-backed image uploads
- Session-based flash messages
- Map-based listing display using OpenStreetMap / MapLibre

## Tech Stack

- Node.js
- Express.js
- EJS
- MongoDB with Mongoose
- Passport.js + Passport Local Mongoose
- Joi for validation
- Cloudinary + Multer
- Express Session + Connect Mongo
- Cloud-based geocoding via OpenStreetMap Nominatim

## Project Structure

- `app.js` — main Express server and app configuration
- `controllers/` — request handlers for listings, reviews, and users
- `models/` — Mongoose schemas for Listing, Review, and User
- `routes/` — route definitions for listings, reviews, and authentication
- `views/` — EJS templates for pages and layouts
- `public/` — frontend assets like CSS and JavaScript
- `middleware.js` — authentication, authorization, and validation middleware
- `schema.js` — Joi validation schemas
- `cloudConfig.js` — Cloudinary image upload setup

## Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install

3.Create a .env file in the project root and add the required environment variables.
Environment Variables
Add the following variables to your .env file:
ATLASDB_URL=your_mongodb_connection_string
SECRET=your_session_secret
CLOUD_NAME=your_cloudinary_cloud_name
CLOUD_API_KEY=your_cloudinary_api_key
CLOUD_SECRET_KEY=your_cloudinary_secret
NODE_ENV=development

Running the Application
Start the server with:
node app.js
