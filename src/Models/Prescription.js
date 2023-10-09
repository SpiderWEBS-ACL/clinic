const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const prescriptionSchema = new Schema(
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
      //type: Schema.Types.ObjectId,   
      type: String,     //until we integrate with pharmacy
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
    },
    Filled: {
      type: String,
      enum: ["Filled","Unfilled"],
    },
  },
  { timestamps: true }
);

const Prescription = mongoose.model("Prescription", prescriptionSchema);
module.exports = Prescription;
