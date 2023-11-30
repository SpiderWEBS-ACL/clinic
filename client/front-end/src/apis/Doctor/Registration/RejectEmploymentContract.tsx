import axios from "axios";
import { BASE_URL } from "../../BaseUrl";
import { config } from "../../../Middleware/authMiddleware";

export const rejectEmploymentContract = async (id: any) => {
  const response = await axios.post(
    `${BASE_URL}/doctor/rejectContract/` + id,
    config
  );
  return response;
};
