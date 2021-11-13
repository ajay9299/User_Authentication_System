const axios = require("axios");
const dotenv = require("dotenv");
dotenv.config();

// IMPORT MESSAGE_FILE
const { messageBox } = require("../constant/message");

// IMPORT STATUS_CODE_FILE
const { statusCode } = require("../constant/statusCode");

// Require restaurant schema
const restaurent = require("../models/restaurant");

// Require lat-lng schema
const latLngs = require("../models/lat_lng");

// Require function file
const { getPlaceInfo, getPlacePhotos } = require("../functions");
const lat_lng = require("../models/lat_lng");

// All promise holders function
const promiseController = (place_id) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Geting details of a place
      const placeInfo = await getPlaceInfo(place_id);

      // Getting the URLS of images
      const photosArr = [];

      if (placeInfo.photos) {
        for (let i = 0; i < placeInfo.photos.length; i++) {
          let url = await getPlacePhotos(placeInfo.photos[i].photo_reference);
          photosArr.push(`${url}`);
        }
      }

      const dataObj = new restaurent({
        place_id: `${placeInfo.place_id}`,
        location: {
          type: "Point",
          coordinates: [
            placeInfo.geometry.location.lng,
            placeInfo.geometry.location.lat,
          ],
        },
        name: placeInfo.name,
        ratings: placeInfo.rating,
        address: placeInfo.formatted_address,
        phoneNo: placeInfo.formatted_phone_number,
        photos: photosArr,
      });
      resolve(dataObj);
    } catch (error) {
      reject(error);
    }
  });
};

// Main api controller function
const mapsController = async (req, res) => {
  try {
    // Getting the queries from user req
    const { lat, lng, type } = req.query;

    const reqSr = await lat_lng.findOne({
      lat_lng: [lng, lat],
      keyword: type.toUpperCase(),
    });

    if (reqSr) {
      return res
        .status(200)
        .json({ msg: `data already present for this request` });
    }

    // Getting the data from near by search api
    const { data } = await axios.get(
      `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat}%2C${lng}&radius=1500&keyword=${type}&key=${process.env.API_KEY}`
    );

    const arrayOfPlace = data.results;

    // Saved the searched place in DB
    const searchPlace = new latLngs({
      lat_lng: [lng, lat],
      keyword: type.toUpperCase(),
    });

    searchPlace.save();

    // finalObjects contain all the place objects
    const finalObjects = [];

    // map the promises
    arrayOfPlace.map(async (value) => {
      finalObjects.push(promiseController(value.place_id));
    });

    await Promise.all(finalObjects)
      .then((object) => {
        object.map(async (data) => {
          await data.save();
        });
      })
      .catch(async (error) => {
        // If promises not resolved then delete the searched data
        await searchPlace.deleteOne({
          lat_lng: [lng, lat],
          keyword: type.toUpperCase(),
        });
      });

    res.json({
      msg: "Data fetched successfully",
    });
  } catch (error) {
    res.json({
      msg: error,
    });
  }
};
module.exports = { mapsController };
