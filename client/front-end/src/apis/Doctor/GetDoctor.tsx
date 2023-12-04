import axios from "axios";
import { BASE_URL } from "../BaseUrl";
import { config } from "../../Middleware/authMiddleware";

export const getDoctor = async () => {
  const response = axios.get(`${BASE_URL}/doctor/getDoctor/`, config);
  return response;
};
