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
        type: String,
        required: true,
    },
    Dosage: {
        type: Number,
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
        //enum: ["Filled,Unfilled"]
      }
  },
  { timestamps: true }
);

const Prescription = mongoose.model("Prescription", prescriptionSchema);
module.exports = Prescription;
