import axios from "axios";
import { BASE_URL } from "../../BaseUrl";
import { config } from "../../../Middleware/authMiddleware";

export const getAllPatientsPrescriptions = async (id: string) => {
  const response = await axios.get(
    `${BASE_URL}/doctor/getAllPatientsPrescriptionsAddedByDoctor/${id}`,
    config
  );
  return response;
};
