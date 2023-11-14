const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const otpSchema = new Schema(
  {
   email: {
    type: String,
    unique: true,
    required: true,
   },
   otp:{
    type: String,
    required: true,
   },
   expiry:{
    type: Date
   }
  },
  { timestamps: true }
);

const OTP = mongoose.model("OTP", otpSchema);
module.exports = OTP;