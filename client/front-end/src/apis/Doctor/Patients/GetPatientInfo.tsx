import axios from "axios";
import { BASE_URL } from "../../BaseUrl";
import { config } from "../../../Middleware/authMiddleware";

export const getPatientInfoApi = async (id: any) => {
  const response = await axios.get(
    `${BASE_URL}/doctor/viewPatientInfo/${id}`,
    config
  );
  return response;
};
