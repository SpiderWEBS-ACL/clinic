const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const cartSchema = new Schema({
  medicines: [
    {
      medicine: {
        type: Schema.Types.ObjectId,
        ref: "Medicine",
      },
      quantity: {
        type: Number,
        default: 1,
      },
    },
  ],
});

module.exports = mongoose.model("Cart", cartSchema);
