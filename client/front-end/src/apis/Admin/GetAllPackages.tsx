import axios from "axios";
import { BASE_URL } from "../BaseUrl";
import { headers } from "../../Middleware/authMiddleware";

export const getAllPackagesAdmin = async () => {
  const response = await axios.get(`${BASE_URL}/admin/allPackages`, {
    headers,
  });
  return response;
};
