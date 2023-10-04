const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const packageSchema = new Schema({
    Name : {
        type: String,
        enum: ["Silver Package","Gold Package","Platinum Package"], //TODO: Remove if can add other options
        required: true,
    },
    SubscriptionPrice: {
        type: Number,
        required: true,
    },
    DoctorDiscount: {
        type: Number,
        required: true,
    },
    PharmacyDiscount: {
        type: Number,
        required: true,
    },
    FamilyDiscount: {
        type: Number,
        required: true,
    }

}, { timestamps: true });

const Package = mongoose.model('Package', packageSchema);
module.exports = Package;