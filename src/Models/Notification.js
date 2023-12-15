const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    Doctor: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "Doctor",
    },
    Patient: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "Patient",
    },
    Appointment: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "Appointment"
    },
    message: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true
    },
    opened: {
      type: Boolean,
      default: false
    },

  },
  { timestamps: true }
);

module.exports = mongoose.model("Notification", notificationSchema);

