const subscriptionModel = require("../Models/Subscription");
const packageModel = require("../Models/Package")
const { default: mongoose } = require("mongoose");
require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const subscribeWithStripe = async (req,res) => {
  try {
    const { packageId } = req.body; 
    const package = await packageModel.findById(packageId);
    console.log(package);
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment', //or subscription
      line_items:[
      {
        price_data: {
          currency: 'usd',
          product_data: {name: package.Name},
          unit_amount: package.SubscriptionPrice
        },
        quantity: 1
      }],
      success_url: `${process.env.SERVER_URL}/patiient/packages`,
      cancel_url: `${process.env.SERVER_URL}/patient/packages` //TODO:back to shopping cart page
    })
    res.json({url: session.url})
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

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
    addSubscription,
    subscribeWithStripe
};