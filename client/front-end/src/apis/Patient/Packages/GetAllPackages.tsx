import axios from "axios";
import { headers } from "../../../Middleware/authMiddleware";
import { BASE_URL } from "../../BaseUrl";

export const getAllPackages = async () => {
  const response = await axios.get(`${BASE_URL}/patient/allPackages`, {
    headers,
  });
  return response.data;
};
