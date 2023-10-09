const patientModel = require("../Models/Patient");
const { default: mongoose } = require("mongoose");
const doctorModel = require("../Models/Doctor");
const appointmentModel = require("../Models/Appointment");
const prescriptionModel = require("../Models/Prescription");
const subscriptionModel = require("../Models/Subscription");

const addPatient = async (req, res) => {
  try {
    const exists = await patientModel.findOne({"Username" : req.body.Username});
    const exists2 = await patientModel.findOne({"Email" : req.body.Email});
    if(!exists && !exists2){
        var newPatient = await patientModel.create(req.body);
        res.status(201).json(newPatient);
    }
    else if(exists){
        res.status(400).json({error:  "Username already taken!" });
    }else{
        res.status(400).json({error:  "Email already registered!" });
    }
}catch(error){
    res.status(400).json({ error: error.message });
}
};

const addFamilyMembers = async (req, res) => {
  try {
    const { id } = req.params;
    const newFamilyMembers = req.body.FamilyMembers;
    const patient = await patientModel.findById(id);
    if (!patient) {
      return res.status(404).json({ error: "Patient not found" });
    }
    const familyMembers = patient.FamilyMembers;
    const allFamilyMembers = familyMembers.concat(newFamilyMembers);
    const updatedPatient = await patientModel.findByIdAndUpdate(id, {
      FamilyMembers: allFamilyMembers,
    }, {new: true}
    );
    res.status(200).json(updatedPatient);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const selectDoctor = async (req, res) => {
  const { id } = req.params;
  try {
    const doctor = await doctorModel.findById(id);
    if (!doctor) {
      return res.status(404).json({ error: "Doctor Not Found" });
    }    
    res.status(200).json(doctor);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const viewDoctorDetails = async (req, res) => {
  const { id } = req.params;
  try{
    if(!id){
      return res.status(404).json({ error: "You must select a doctor" });
    }
    else{
      const doctor = await doctorModel.findById(id);
      const doctorInfo = {
        Name: doctor.Name,
        Email: doctor.Email,
        Specialty: doctor.Specialty,
        Affiliation: doctor.Affiliation,
        EducationalBackground: doctor.EducationalBackground
      }
      return res.status(200).json(doctorInfo)
    }
  } catch (error){
    res.status(500).json({ error: error.message });
  }
}

const viewMyPrescriptions = async (req, res) => {
  try {
    const { id } = req.params;
    const prescriptions = await prescriptionModel.find({Patient: id});
    if(!prescriptions){
      return res.status(404).json({error: "You do not have any prescriptions yet"})
    }
    else{
      return res.status(200).json(prescriptions);
    }
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }

}

const filterPrescriptions = async (req, res) => {
  try {
    const { Date, Doctor, Filled } = req.body;
    const { id } = req.params;

    if (Date || Doctor || Filled) {
      const filter = {};
      if (Date) {
        filter.Date = { $gte: new Date(Date) };
      }
      if (Doctor) {
        filter.Doctor = Doctor;
      }
      if (Filled) {
        filter.Filled = Filled;
      }

      const patient = await patientModel.findById(id);

      if(!patient){
        return res.status(404).json({ error: "Patient Not Found!" });
      }

      filter.Patient = patient;   //only get prescriptions of patient not all

      const prescriptions = await prescriptionModel.find(filter);

      if(prescriptions.length == 0){
        return res.status(404).json({ error: "No prescriptions found with the given details" });
      }

      return res.status(200).json(prescriptions);
    } else {
      return res
        .status(404)
        .json({ error: "Please Specify Filtering Criteria" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const selectPrescription = async (req, res) =>{
    const prescID = req.params.id;
  try {
    const prescription = await prescriptionModel.findById(prescID);
    if (!prescription) {
      return res.status(404).json({ error: "Prescription not found" });
    }
    else{
      res.status(200).json(prescription);

    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

const viewFamilyMembers = async (req, res) => {
    const { id } = req.params;
    try{
        const patient = await patientModel.findById(id);

        if(!patient){
          return res.status(404).json({ error: "Patient Not Found!" });
        }

        const familyMembers = patient.FamilyMembers;

        if(familyMembers.length == 0){
          return res.status(404).json({ error: "You have no registered family members" });
        }

        res.status(200).json(familyMembers)
    }
    catch(error){
        res.status(500).json({error: error.message})
    }
};

const filterDoctors = async (req, res) => {
  const specialty = req.body.Specialty;
  const dateTime = req.body.DateTime;

  try {
    var doctors;

    if(!specialty && !dateTime){
      return res.status(404).json({ error: "Please Specify Filtering Criteria"});
    }

    else if (specialty && dateTime) {           //filter on specialty AND availability
      doctors = await doctorModel.aggregate([
        {
          $match: { Specialty: { $regex: specialty, $options: "i"} },   //filter doctors by specialty ($regex, $options: "i" --> case insensitive)
        },
        {
          $lookup: {                    //join with appointments --> adds "appointments" field to doctors (array of appointments)
            from: "appointments",
            localField: "_id",
            foreignField: "Doctor",
            as: "appointments",
          },
        },
        {
          $match: {             //filter only doctors with no appointments on dateTime
            "appointments.AppointmentDate": {$ne : new Date(dateTime)}      //$ne = not equals
          },
        },
      ]);
    } 

    else if (dateTime) {            //filter on availability ONLY
      doctors = await doctorModel.aggregate([
        {
          $lookup: {
            from: "appointments",
            localField: "_id",
            foreignField: "Doctor",
            as: "appointments",
          },
        },
        {
          $match: {
            "appointments.AppointmentDate": {$ne : new Date(dateTime)} 
          },
        },
      ]);
    } 

    else if (specialty) {             //filter on Specialty ONLY
      doctors = await doctorModel.find({
        Specialty: { $regex: specialty, $options: "i"},
      });
    }

    if(doctors.length == 0){     
      return res.status(404).json({ error: "No Doctors Found"});
    }
    
    res.status(200).json(doctors);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const filterPatientAppointments = async(req,res) =>{
  const { id } = req.params;
  const date = req.body.Date;
  const status = req.body.Status;

  if(!date && !status){
    return res.status(400).json({ error: "Please Specify Filtering Criteria" });
  }

  const query = {
    $and:[
      {Patient: id},
      { $or: [
          { AppointmentDate: { $gte: date } }, 
          { Status: status }
       ]}
    ]
  };
  try{
      const appointments = await appointmentModel.find(query).populate("Doctor").exec();
      if(!appointments || appointments.length === 0){
          res.status(404).json({error: "No appointments were found"});
      }
      else
          res.status(200).json(appointments);
      }catch(error){
      res.status(500).json({ error: error.message });
  }
}

const searchForDoctor = async (req, res) => {
  const { Name, Specialty } = req.body;

  if (!Name && !Specialty) {
    return res.status(400).json({ error: 'Name or Specialty parameter is required' });
  }

  try {
    let query = {};

    if (Name) {
      query.Name = { $regex: Name, $options: 'i' };
    }

    if (Specialty) {
      query.Specialty = { $regex: Specialty, $options: 'i' };
    }

    const doctors = await doctorModel.find(query);

    if (doctors.length === 0) {
      return res.status(404).json({ error: 'No doctors found matching the criteria' });
    }

    res.status(200).json(doctors);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while searching for doctors' });
  }
};


const calculateDiscount = (doctor, healthPackage) => {
  if (!healthPackage) {
    return 0; 
  }
  const packageDiscount = healthPackage.DoctorDiscount;
  return (doctor.HourlyRate) * (packageDiscount / 100);     
}


const viewDoctorsWithPrices = async (req, res) => {
  const patientId = req.params.id;

  try {
    const subscription = await subscriptionModel.findOne({ Patient: patientId }).populate('Package');
    let healthPackage = null;
    if (subscription) {
      healthPackage = subscription.Package;
    }
    const doctors = await doctorModel.find();
    const doctorsWithPrices = doctors.map(doctor => {
      let sessionPrice = doctor.HourlyRate + (0.1 * doctor.HourlyRate);   //doctor rate + 10% clinic markup 

      if (healthPackage) {
        sessionPrice -= calculateDiscount(doctor, healthPackage);   //if package --> discount
        sessionPrice = sessionPrice > 0 ? sessionPrice : 0; 
      }

      return {
        doctorName: doctor.Name,
        specialty: doctor.Specialty,
        sessionPrice
      };
    });

    res.status(200).json(doctorsWithPrices);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



module.exports = { addPatient, addFamilyMembers, selectDoctor, viewFamilyMembers, filterDoctors , searchForDoctor,
   filterPatientAppointments,  viewDoctorDetails, viewMyPrescriptions, filterPrescriptions, selectPrescription,
  viewDoctorsWithPrices};

