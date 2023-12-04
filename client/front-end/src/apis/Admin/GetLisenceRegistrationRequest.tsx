import axios from "axios";
import { BASE_URL } from "../BaseUrl";
import { headers } from "../../Middleware/authMiddleware";

export const getLisenceRegistrationRequest = async (id: any) => {
  const response = await axios.get(`${BASE_URL}/admin/getLicenses/` + id, {
    headers,
  });
  return response;
};
