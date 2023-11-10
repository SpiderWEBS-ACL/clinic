const mongoose = require("mongoose")
const Schema = mongoose.Schema;

const subscriptionSchema = Schema({
    Patient: { type: Schema.Types.ObjectId,
        ref: 'Patient',
        required: true 
       },
    Package: { type: Schema.Types.ObjectId,
        ref: 'Package',
        required: true
    }
});
const Subscription = mongoose.model("Subscription", subscriptionSchema);
module.exports = Subscription;