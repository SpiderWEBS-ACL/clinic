import axios from "axios";
import { BASE_URL } from "../BaseUrl";
import { headers } from "../../Middleware/authMiddleware";

export const addPrescription = async (Data: any) => {
  const response = await axios.post(
    `${BASE_URL}/doctor/addPrescription`,
    Data,
    { headers: headers }
  );
  return response;
};
