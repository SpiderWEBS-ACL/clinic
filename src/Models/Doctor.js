const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const doctorSchema = new Schema({
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
    Rate: {
        type: Number,
        required: true,
    },
    Affiliation: {
        type: String,
        required: true,
    },
    EducationalBg: {
        type: String,
        required: true,
      },
}, { timestamps: true });

const Doctor = mongoose.model('doctor', doctorSchema);
module.exports = Doctor;