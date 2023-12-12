import axios from "axios";
import { BASE_URL } from "../../BaseUrl";
import { Prescription } from "../../../types";
import { headers } from "../../../Middleware/authMiddleware";

export const updateMedicineInPrescription = async (
  prescription: Prescription | undefined
) => {
  const response = await axios.put(
    `${BASE_URL}/doctor/updateMedicineInPrescription`,
    prescription,
    { headers: headers }
  );
  return response;
};
