const jwt = require('jsonwebtoken');
const patientModel = require('../Models/Patient');
const doctorModel = require('../Models/Doctor');
const adminModel = require('../Models/Admin');
const { Next } = require('@nestjs/common');


function generateAccessToken(id){
    return jwt.sign(id, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '1d'})
  }

const AdminProtect = async (req,res,next) => {
    let token;
    const authHeader = req.headers.authorization;
    console.log(authHeader);
    if(authHeader){
    try{
    //Get token from header
     token = authHeader.split(' ')[1];

     //Verify Token
     const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

     //Get Admin from token

     req.user = await adminModel.findById(decoded.id);
     next();
    }catch(error){
        console.log(error)
        res.status(401)
        res.status(401).json({error: "Not Authorized"});

    }
    }
    if(!token){
       return res.status(401).json({error: "No Token"})
    }
    
    }
const PatientProtect = async (req,res,next) => {
    let token;
    const authHeader = req.headers.authorization;
    if(authHeader){
    try{
    //Get token from header
     token = authHeader.split(' ')[1];

     //Verify Token
     const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

     //Get User from token
     req.user = await patientModel.findById(decoded.id);

     next();
    }catch(error){
        console.log(error)
        res.status(401)
        res.status(401).json({error: "Not Authorized"});

    }
    }
    if(!token){
        res.status(401)
        res.status(401).json({error: "No Token"});
    }
    }
const DoctorProtect = async (req,res,next) => {
    let token;
    const authHeader = req.headers.authorization;
    if(authHeader){
    try{
    //Get token from header
     token = authHeader.split(' ')[1];

     //Verify Token
     const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

     //Get User from token

     req.user = await doctorModel.findById(decoded.id);

     next();
    }catch(error){
        console.log(error)
        res.status(401).json({error: "Not Authorized"});
    }
    }
    if(!token){
        res.status(401).json({error: "No Token"});
    }
    }

module.exports = {PatientProtect, DoctorProtect, AdminProtect, generateAccessToken};