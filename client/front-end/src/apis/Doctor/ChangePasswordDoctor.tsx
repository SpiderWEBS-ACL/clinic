import axios from "axios";
import { headers } from "../../Middleware/authMiddleware";
import { BASE_URL } from "../BaseUrl";

export const changePasswordDoctor = async (data: any) => {
  axios.put(`${BASE_URL}/doctor/changePassword`, data, {
    headers: headers,
  });
};
