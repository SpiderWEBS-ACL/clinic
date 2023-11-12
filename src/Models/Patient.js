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
    HealthRecords: [{
      Doctor: {
        type: Schema.Types.ObjectId,
        ref: "Doctor",
      },
      Description: {
        type: String,
      },
      Type: {
        type: String,
      }
    }],
    FamilyMembers: [{
      PatientID:{
        type: Schema.Types.ObjectId,
        ref: 'Patient',
        required: false
      },
      Name: {
        type: String,
        required: true,
      },
      MemberID: { 
        type: Schema.Types.ObjectId,
        ref: 'Patient',
       },
      RelationToPatient: {
        type: String,
        enum: ["Wife", "Husband", "Son", "Daughter"],
        required: true,
      },
      Email:{
        type: String,
        required: false
      },
      NationalID: {
        type: String,
        required: false,
      },
      Age: {
        type: Number,
        required: true,
      },
      Gender: {
        type: String,
        enum: ["Male", "Female"],
        requiired: true,
      },
      MedicalHistory:{
        type: Schema.Types.ObjectId,
        ref: "File"
     }
    }],
    WalletBalance: {
      type: Number,
      default: 0
    }
}, { timestamps: true });

const Patient = mongoose.model('Patient', patientSchema);
module.exports = Patient;