import axios from "axios";
import { BASE_URL } from "../BaseUrl";
import { headers } from "../../Middleware/authMiddleware";

export const getPackageDetails = async (id: any) => {
  const response = await axios.get(`${BASE_URL}/admin/package/${id}`, {
    headers,
  });
  return response;
};
