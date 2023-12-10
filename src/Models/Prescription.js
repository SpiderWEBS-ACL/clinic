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
      Medicines: [
        {MedicineId: {
          type: Schema.Types.ObjectId,
          ref: "Medicine"
        },
        Dosage: {
          type: Number,
        },
        Instructions: {
          type: String,
        }}],
      UnavailableMedicines: [
        {Medicine: {
          type: String, 
        },
        Dosage: {
          type: Number,
        },
        Instructions: {
          type: String,
        }}],
        Date: {
          type: Date,
          default: Date.now,
        },
        Filled: {
          type: String,
          default: "Unfilled",
          //enum: ["Filled,Unfilled"]
        }
    },
    { timestamps: true }
  );

  const Prescription = mongoose.model("Prescription", prescriptionSchema);
  module.exports = Prescription;
