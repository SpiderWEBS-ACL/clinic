const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const prescriptionsSchema = new Schema(
  {
    Doctor: {
      type: Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
    },
    Patient: {
      type: Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },
    Medication: {
        type: Schema.Types.ObjectId,
        required: true,
    },
    Dosage: {
        type: String,
        required: true,
      },
    Instructions: {
        type: String,
        required: true,
      },
      Date: {
        type: Date,
        default: Date.now,
      } 
  },
  { timestamps: true }
);

const Prescription = mongoose.model("Prescription", prescriptionsSchema);
module.exports = Prescription;
