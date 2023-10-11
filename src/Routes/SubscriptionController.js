const subscriptionModel = require("../Models/Subscription");
const { default: mongoose } = require("mongoose");

const addSubscription = async (req, res) => {
    try {
      
      const { packageId } = req.body; 
      const subscription = new subscriptionModel({
        Patient: req.params.id,  
        Package: packageId
      });

      await subscription.save();

      res.status(201).json({ message: 'Subscription added successfully', subscription });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

module.exports = {
    addSubscription
};