import axios from "axios";
import { BASE_URL } from "../BaseUrl";
import { headers } from "../../Middleware/authMiddleware";

export const getDegree = async (id: any) => {
  const response = await axios.get(`${BASE_URL}/admin/getDegree/` + id, {
    headers,
  });
  return response;
};
