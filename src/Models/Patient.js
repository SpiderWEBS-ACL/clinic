const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const patientSchema = new Schema({
    Username: {
        type: String,
        required: true,
      },
  Name: {
    type: String,
    required: true,
  },
  Email: {
    type: String,
    required: true
  },
  Password: {
    type: String,
    required: true,
},
    Dob: {
        type: Date,
        required: true,
    },
    Gender: {
        type: String,
        required: true,
    },
    Mobile: {
        type: Number,
        required: true,
    },
    EmergencyContactName: {
        type: String,
        required: true,
      },
      EmergencyContactMobile: {
        type: Number,
        required: true,
    },
    FamilyMembers: [{
      Name: {
        type: String,
        required: true,
      },
      RelationToPatient: {
        type: String,
        enum: ["Wife", "Husband", "Son", "Daughter"],
        required: true,
      },
      NationalID: {
        type: String,
        required: true,
      },
      Age: {
        type: Number,
        required: true,
      },
      Gender: {
        type: String,
        enum: ["Male", "Female"],
        requiired: true,
      }
    }],
    WalletBalance: {
      type: Number,
      default: 0
    }
}, { timestamps: true });

const Patient = mongoose.model('Patient', patientSchema);
module.exports = Patient;