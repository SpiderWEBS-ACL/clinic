const mongoose = require('mongoose');
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
}, { timestamps: true });

const Patient = mongoose.model('Pateint', patientSchema);
module.exports = Patient;