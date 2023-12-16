import axios from "axios";
import { BASE_URL } from "../../BaseUrl";
import { config, headers } from "../../../Middleware/authMiddleware";

export const fillPrescriptionApi = async (id: string) => {
  console.log("in fill presc api");
  const response = await axios.put(
    `${BASE_URL}/patient/fillPrescription/${id}`,
    {},
    { headers: headers }
  );
  return response;
};
