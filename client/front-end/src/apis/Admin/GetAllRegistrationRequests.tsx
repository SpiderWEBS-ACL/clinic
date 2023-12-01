import axios from "axios";
import { BASE_URL } from "../BaseUrl";
import { headers } from "../../Middleware/authMiddleware";

export const getAllRegistrationRequests = async () => {
  const response = await axios.get(`${BASE_URL}/admin/registrationRequests`, {
    headers,
  });
  return response;
};
