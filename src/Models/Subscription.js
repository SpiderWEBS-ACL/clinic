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
    }, 
    Date: {
        type: Date,
        required: false,
        default: function () {
            let date = new Date(Date.now());
            date.setMonth(date.getMonth()+1)
            return date
    }},
    Status:{
        type:String ,  
        enum:[ "Subscribed","Cancelled"],
        default: "Subscribed"
    }
});
const Subscription = mongoose.model("Subscription", subscriptionSchema);
module.exports = Subscription;