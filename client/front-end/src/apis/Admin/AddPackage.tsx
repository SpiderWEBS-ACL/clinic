import axios from "axios";
import { BASE_URL } from "../BaseUrl";
import { headers } from "../../Middleware/authMiddleware";

export const addPackage = async (data: any) => {
  const response = await axios.post(`${BASE_URL}/admin/addPackage`, data, {
    headers,
  });
  return response;
};
