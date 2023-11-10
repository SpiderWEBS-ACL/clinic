const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const doctorRegisterSchema = new Schema({
    Username: {
        type: String,
        required: true,
      },
      PersonalID:{
        type: Schema.Types.ObjectId,
        ref: "File",
      },
      MedicalDegree:{
        type: Schema.Types.ObjectId,
        ref: "File",
      },
      MedicalLicenses:[{
        type: Schema.Types.ObjectId,
        ref: "File",
      }],
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
    HourlyRate: {
        type: Number,
        required: true,
    },
    Affiliation: {
        type: String,
        required: true,
    },
    EducationalBackground: {
        type: String,
        required: true,
      },


    Specialty: {
      type: String,
      required: true,
    },
    AvailableTimeSlots : [
      {
        type: String,
      },
    ]
}, { timestamps: true });

const DoctorRegister = mongoose.model('DoctorRegister', doctorRegisterSchema);
module.exports = DoctorRegister;