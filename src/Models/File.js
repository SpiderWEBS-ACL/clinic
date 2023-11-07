const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const fileSchema = new Schema(
  {
    Patient: {
      type: Schema.Types.ObjectId,
      ref: "Patient",
    },
    filename:{
        type: String,
        required: true
    },
    originalname:{
        type: String,
        required: true
    },
    path:{
        type: String,
        required: true
    }
  }
);

const File = mongoose.model("File", fileSchema);
module.exports = File;


