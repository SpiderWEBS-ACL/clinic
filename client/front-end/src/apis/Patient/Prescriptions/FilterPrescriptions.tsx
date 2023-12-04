import axios from "axios";
import { BASE_URL } from "../../BaseUrl";
import { headers } from "../../../Middleware/authMiddleware";
export const filterPrescriptions = async (
  Doctor: any,
  Filled: any,
  Date: any,
  id: any
) => {
  const response = await axios.get(`${BASE_URL}/patient/filterPrescriptions`, {
    params: {
      Doctor: Doctor,
      Filled: Filled,
      Date: Date,
      Patient: id,
    },
    headers: headers,
  });
  return response;
};
