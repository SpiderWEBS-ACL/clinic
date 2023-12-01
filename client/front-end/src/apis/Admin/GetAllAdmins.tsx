import axios from "axios";
import { BASE_URL } from "../BaseUrl";
import { config } from "../../Middleware/authMiddleware";

export const getAllAdmins = async () => {
  const response = await axios.get(`${BASE_URL}/admin/allAdmins`, config);
  return response;
};
