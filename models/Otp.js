const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema(
  {
    phone: {
      type: Number,

      required: true,
    },
    otp: {
      type: Number,
      required: true,
    },
    createdAt: { type: Date, default: Date.now, index: { expires: 180 } },
  },
  { timestamps: true }
);

module.exports = mongoose.model("otp", otpSchema);
