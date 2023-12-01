import axios from "axios";
import { BASE_URL } from "../BaseUrl";
import { headers } from "../../Middleware/authMiddleware";

export const updatePackage = async (id: any, data: any) => {
  const response = await axios.put(
    `${BASE_URL}/admin/updatePackage/${id}`,
    data,
    {
      headers,
    }
  );
  return response;
};
