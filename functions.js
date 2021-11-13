const axios = require("axios");
const dotenv = require("dotenv");
dotenv.config();

// Require restaurant schema
const restaurent = require("./models/restaurant");

module.exports = {
  getPlaceInfo: async (placeId) => {
    // Get the data of place
    const { data } = await axios.get(
      `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${process.env.API_KEY}`
    );

    return data.result;
  },
  getPlacePhotos: async (photoReferenceId) => {
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${photoReferenceId}&key=${process.env.API_KEY}`
    );
    const fetchedUrl = response.request.res.responseUrl;
    return fetchedUrl;
  },
};
