import axios from "axios";
import { config, headers } from "../../../Middleware/authMiddleware";
import { BASE_URL } from "../../BaseUrl";

export const rejectFollowUpRequest = async (id: any) => {
  const response = await axios.delete(
    `${BASE_URL}/appointment/rejectFollowUpRequest/${id}`,config
  );
  return response;
};
