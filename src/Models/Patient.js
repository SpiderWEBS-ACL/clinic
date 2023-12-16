const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const patientSchema = new Schema(
  {
    Username: {
      type: String,
      required: true,
    },
    Name: {
      type: String,
      required: true,
    },
    Email: {
      type: String,
      required: true,
    },
    Password: {
      type: String,
      required: true,
    },
    Dob: {
      type: Date,
      required: true,
    },
    Gender: {
      type: String,
      required: true,
    },
    Mobile: {
      type: Number,
      required: true,
    },
    WalletBalance: {
      type: Number,
      default: 0,
    },
    Wallet: {
      type: Number,
      default: 0,
    },
    EmergencyContact: {
      Name: {
        type: String,
        required: false,
        default: "",
      },

      Mobile: {
        type: Number,
        required: false,
        default: "",
      },

      relationToPatient: {
        //no limitations mentioned so no ENUM
        type: String,
        required: false,
        default: "",
      },
    },
    EmergencyContactName: {
      type: String,
      required: false,
      default: function () {
        return this.EmergencyContact.Name || "";
      },
    },
    EmergencyContactMobile: {
      type: Number,
      required: false,
      default: function () {
        return this.EmergencyContact.Mobile || 0;
      },
    },
    HealthRecords: [
      {
        Doctor: {
          type: Schema.Types.ObjectId,
          ref: "Doctor",
        },
        Description: {
          type: String,
        },
        Type: {
          type: String,
        },
      },
    ],

    FamilyMembers: [
      {
        PatientID: {
          type: Schema.Types.ObjectId,
          ref: "Patient",
          required: false,
        },
        Name: {
          type: String,
          required: false,
        },
        MemberID: {
          type: Schema.Types.ObjectId,
          ref: "Patient",
        },
        RelationToPatient: {
          type: String,
          enum: ["Wife", "Husband", "Son", "Daughter"],
          required: false,
        },
        Email: {
          type: String,
          required: false,
        },
        NationalID: {
          type: String,
          required: false,
        },
        Age: {
          type: Number,
          required: false,
        },
        Gender: {
          type: String,
          enum: ["Male", "Female"],
          requiired: false,
        },
        Subscription: {
          type: Schema.Types.ObjectId,
          ref: "Subscription",
        },
      },
    ],

    MedicalHistory: [
      {
        type: Schema.Types.ObjectId,
        ref: "File",
      },
    ],
    VideoSocketId: {
      type: String,
      default: "",
    },
    Cart: {
      type: Schema.Types.ObjectId,
      ref: "Cart",
      required: false,
    },
    shippingAddresses: [String],
  },
  { timestamps: true }
);

const Patient = mongoose.model("Patient", patientSchema);
module.exports = Patient;
