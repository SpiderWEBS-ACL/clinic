import axios from "axios";
import { BASE_URL } from "../BaseUrl";
import { headers } from "../../Middleware/authMiddleware";

export const addAdmin = async (data: any) => {
  const response = await axios.post(`${BASE_URL}/admin/add`, data, { headers });
  return response;
};
