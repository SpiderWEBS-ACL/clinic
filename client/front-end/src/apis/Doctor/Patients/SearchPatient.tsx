import axios from "axios";
import { BASE_URL } from "../../BaseUrl";
import { config } from "../../../Middleware/authMiddleware";

export const searchPatient = async (name: any) => {
  const response = await axios.get(
    `${BASE_URL}/doctor/searchPatient/${name}`,
    config
  );
  return response;
};
