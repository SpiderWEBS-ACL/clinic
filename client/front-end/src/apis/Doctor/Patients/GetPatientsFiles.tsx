import axios from "axios";
import { BASE_URL } from "../../BaseUrl";
import { config } from "../../../Middleware/authMiddleware";

export const getPatientsFiles = async (id: any) => {
  const response = await axios.get(
    `${BASE_URL}/doctor/viewPatientFiles/${id}`,
    config
  );
  return response;
};
