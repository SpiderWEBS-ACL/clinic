const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const packageSchema = new Schema({
    Name : {
        type: String,
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
    },
    FamilyPrice: {
        type: Number,
        default: function () {
            return this.SubscriptionPrice * (1 - this.FamilyDiscount/100);
        }},

}, { timestamps: true });

const Package = mongoose.model('Package', packageSchema);
module.exports = Package;