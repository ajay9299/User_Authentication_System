const mongoose = require("mongoose");

// GeoJson format
const pointSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["Point"],
    required: true,
  },
  coordinates: {
    type: [Number],
    required: true,
  },
});

const resSchema = new mongoose.Schema({
  place_id: {
    type: String,
    required: true,
  },
  location: {
    type: pointSchema,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  ratings: {
    type: Number,
    default: 0,
  },
  address: {
    type: String,
  },
  phoneNo: {
    type: String,
  },
  photos: {
    type: [String],
  },
});

module.exports = mongoose.model("restaurent", resSchema);
