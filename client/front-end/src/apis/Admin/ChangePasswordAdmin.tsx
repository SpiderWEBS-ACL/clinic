import axios from "axios";
import { BASE_URL } from "../BaseUrl";
import { headers } from "../../Middleware/authMiddleware";

export const changePasswordAdmin = async (data: any) => {
  const response = await axios.put(`${BASE_URL}/admin/changePassword`, data, {
    headers: headers,
  });
  return response;
};
