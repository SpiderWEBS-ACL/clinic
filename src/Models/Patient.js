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
    type: Password,
    required: true,
},
    DOB: {
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
    ecName: {
        type: String,
        required: true,
      },
      ecMobile: {
        type: Number,
        required: true,
    },
}, { timestamps: true });

const Pateint = mongoose.model('pateint', patientSchema);
module.exports = Patient;