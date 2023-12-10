import axios from "axios";
import { BASE_URL } from "../BaseUrl";
import { config } from "../../Middleware/authMiddleware";

export const getAllMedicines = async () => {
  const response = await axios.get(`${BASE_URL}/doctor/getAllMedicines`,config);
  return response;
};
