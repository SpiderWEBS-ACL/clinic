import axios from "axios";
import { BASE_URL } from "../BaseUrl";
import { headers } from "../../Middleware/authMiddleware";

export const getAllPatients = async () => {
  const response = await axios.get(`${BASE_URL}/admin/allPatients`, {
    headers,
  });
  return response;
};
