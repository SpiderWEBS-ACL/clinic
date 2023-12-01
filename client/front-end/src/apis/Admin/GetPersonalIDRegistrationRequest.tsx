import axios from "axios";
import { BASE_URL } from "../BaseUrl";
import { headers } from "../../Middleware/authMiddleware";

export const getPersonalIDRegistrationRequest = async (id: any) => {
  const response = await axios.get(`${BASE_URL}/admin/getPersonalID/` + id, {
    headers,
  });
  return response;
};
