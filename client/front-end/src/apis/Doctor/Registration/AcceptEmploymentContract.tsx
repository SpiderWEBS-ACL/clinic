import axios from "axios";
import { config } from "../../../Middleware/authMiddleware";
import { BASE_URL } from "../../BaseUrl";

export const acceptEmploymentContract = async (id: any) => {
  const response = await axios.post(
    `${BASE_URL}/doctor/acceptContract/` + id,
    config
  );
  return response;
};
