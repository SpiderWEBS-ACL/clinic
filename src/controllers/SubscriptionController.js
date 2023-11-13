const subscriptionModel = require("../Models/Subscription");
const packageModel = require("../Models/Package")
const patientModel = require("../Models/Patient")
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
      success_url: `${process.env.SERVER_URL}/subscription/success`,
      cancel_url: `${process.env.SERVER_URL}/patient/packages` //TODO:back to shopping cart page
    })
    res.json({url: session.url})
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}
const subscribeWithWallet = async (req,res) => {
  try {
    const { packageId } = req.body; 
    const package = await packageModel.findById(packageId);
    console.log(package);
    console.log(req.user);
    if(req.user.WalletBalance >= package.SubscriptionPrice)
      var updatePatient = await patientModel.findByIdAndUpdate(req.user.id, {WalletBalance: req.user.WalletBalance - package.SubscriptionPrice} )
    else
      return res.status(500).json("Insufficient")
    return res.status(200).json("Success");
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

const addSubscription = async (req, res) => {
    try {
      console.log("Here");
      const { packageId } = req.body;
      const subscribedAlready = await subscriptionModel.findOne({Patient: req.user.id}) 
      if(subscribedAlready)
        return res.status(400).json("You are already subscribed to a package");
      const subscription = {
        Patient: req.user.id,  
        Package: packageId
      };
      const newSubscription = await subscriptionModel.create(subscription);
      res.status(201).json({ message: 'Subscription added successfully', newSubscription });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  const deleteOneSubscription = async (req, res) => {
    try {
      const subscriptions = await subscriptionModel.find({Patient: req.user.id})
      if(subscriptions.length == 2)
        var deletedSubscription = await subscriptionModel.deleteOne({Patient: req.user.id});
    }catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
  const getSubscription = async (req,res) => {
    const id = req.user.id;
    const subscription = await subscriptionModel.findOne({Patient: id});
    if(!subscription)
      return res.status(200).json("");
    if(subscription)
    return res.status(200).json(subscription);
  }
module.exports = {
    addSubscription,
    subscribeWithStripe,
    deleteOneSubscription,
    subscribeWithWallet,
    getSubscription
};