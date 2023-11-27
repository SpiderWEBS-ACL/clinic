import axios from "axios";
import { BASE_URL } from "../../BaseUrl";
import { headers } from "../../../Middleware/authMiddleware";

export const linkFamilyMember = async (data: any) => {
  const response = axios.post(`${BASE_URL}/patient/linkFamily`, data, {
    headers,
  });
  return response;
};
