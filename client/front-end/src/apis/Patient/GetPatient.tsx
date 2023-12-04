import axios from "axios";
import { config } from "../../Middleware/authMiddleware";
import { BASE_URL } from "../BaseUrl";

export const getPatient = async () => {
  const response = await axios.get(`${BASE_URL}/patient/getPatient`, config);
  return response.data;

};
