const mongoose = require("mongoose");

const latLng = new mongoose.Schema(
  {
    lat_lng: {
      type: [Number],
      require: true,
    },
    keyword: {
      type: String,
      require: true,
    },
    lastUpdated: {
      type: Date,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("latlng", latLng);
