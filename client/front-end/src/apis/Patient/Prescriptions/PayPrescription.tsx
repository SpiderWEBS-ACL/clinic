import axios from "axios";
import { Prescription } from "../../../types";
import { BASE_URL } from "../../BaseUrl";
import { headers } from "../../../Middleware/authMiddleware";

export const payPrescription = async (prescription: Prescription) => {
  const response = await axios.post(
    `${BASE_URL}/patient/payPrescription`,
    prescription,
    { headers: headers }
  );
  return response;
};
