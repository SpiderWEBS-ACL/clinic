import axios from "axios";
import { BASE_URL } from "../BaseUrl";
import { headers } from "../../Middleware/authMiddleware";

export const deletePatient = async (id: any) => {
  const response = await axios.delete(`${BASE_URL}/admin/removePatient/${id}`, {
    headers,
  });
  return response;
};
