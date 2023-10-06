const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const appointmentSchema = new Schema({
    Doctor: { type: Schema.Types.ObjectId,
         ref: 'Doctor',
          required: true
        },
    Patient: { type: Schema.Types.ObjectId,
         ref: 'Patient',
          required: true 
        },
    AppointmentDate: Date,
  });


  const Appointment = mongoose.model("Appointment",appointmentSchema);
  module.exports = Appointment;