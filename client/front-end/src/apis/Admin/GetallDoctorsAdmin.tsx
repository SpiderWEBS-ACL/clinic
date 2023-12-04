import axios from "axios";
import { BASE_URL } from "../BaseUrl";
import { headers } from "../../Middleware/authMiddleware";

export const getAllDoctorsAdmin = async () => {
  const response = await axios.get(`${BASE_URL}/admin/allDoctors`, { headers });
  return response;
};
