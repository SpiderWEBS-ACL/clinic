import axios from "axios";
import { BASE_URL } from "../BaseUrl";
import { config } from "../../Middleware/authMiddleware";

export const deleteAdmin = async (id: any) => {
  const response = await axios.delete(
    `${BASE_URL}/admin/removeAdmin/${id}`,
    config
  );
  return response;
};
