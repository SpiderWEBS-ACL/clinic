import axios from "axios";
import { headers } from "../../Middleware/authMiddleware";
import { BASE_URL } from "../BaseUrl";

export const changePasswordPatientApi = async (data: any) => {
  const response = await axios.put(`${BASE_URL}/patient/changePassword`, data, {
    headers: headers,
  });
  return response;
};
