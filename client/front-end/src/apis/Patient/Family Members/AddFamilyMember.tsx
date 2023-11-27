import axios from "axios";
import { headers } from "../../../Middleware/authMiddleware";
import { BASE_URL } from "../../BaseUrl";

export const addFamilyMemberApi = async (data: any) => {
  return await axios.post(`${BASE_URL}/patient/addFamilyMember/`, data, {
    headers,
  });
};
