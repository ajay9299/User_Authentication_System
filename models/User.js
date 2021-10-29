const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  fname: {
    type: String,
    required: true,
  },
  lname: {
    type: String,
    required: true,
  },
  employeId: {
    type: String,
  },
  depName: {
    type: String,
  },
  country: {
    type: String,
    required: true,
  },
  email: {
    type: String,
  },
  phone: {
    type: Number,
  },
  password: {
    type: String,
    required: true,
  },
  emailToken: {
    type: String,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("User", userSchema);
