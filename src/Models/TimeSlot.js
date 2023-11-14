const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const timeSlotSchema = new Schema({
  Doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor',
    required: true,
  },
  day: {
    type: String,
    required: true
  },
  slots:[ {
    type: String,
    required: true,
  }],
});

const TimeSlot = mongoose.model('TimeSlot', timeSlotSchema);

module.exports = TimeSlot;
