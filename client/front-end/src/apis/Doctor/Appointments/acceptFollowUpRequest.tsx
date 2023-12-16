import axios from "axios";
import { config, headers } from "../../../Middleware/authMiddleware";
import { BASE_URL } from "../../BaseUrl";

export const acceptFollowUpRequest = async (id: any) => {
  const response = await axios.get(
    `${BASE_URL}/appointment/acceptFollowUpRequest/${id}`,config
  );
  return response;
};
