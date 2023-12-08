const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "authorType",
      required: true,
    },
    authorType: {
      type: String,
      enum: ["Doctor", "Pharmacist", "Patient"],
      required: true,
    },

    content: {
      type: String,
      required: [true, "can't be blank"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Message", messageSchema);
