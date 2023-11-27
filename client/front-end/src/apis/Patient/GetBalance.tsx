import axios from "axios";
import { config } from "../../Middleware/authMiddleware";
import { BASE_URL } from "../BaseUrl";

export const getBalance = async () => {
  const response = await axios.get(`${BASE_URL}/patient/getBalance`, config);
  return response;
};
