const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const appointmentSchema = new Schema({
    title:{ type: String,
      default: "Appointment"
    },

    Doctor: { type: Schema.Types.ObjectId,
         ref: 'Doctor',
          required: true
        },
    Patient: { type: Schema.Types.ObjectId,
         ref: 'Patient',
          required: true 
        },
    AppointmentDate: Date,
    start: {
      type: Date,
      default: function () {
          return new Date(this.AppointmentDate.getTime() - 120 * 60 * 1000);
      }},
    end: {
      type: Date,
      default: function () {
          return new Date(this.AppointmentDate.getTime() - 60 * 60 * 1000);
      }},
    FollowUp: {
      type: Boolean,
    },
    Status:{
      type : String ,  
      enum:[ "Upcoming","Completed","Cancelled","Rescheduled"],
      default: "Upcoming"
    } 
    },{ timestamps: true });


const Appointment = mongoose.model("Appointment", appointmentSchema);
module.exports = Appointment;

