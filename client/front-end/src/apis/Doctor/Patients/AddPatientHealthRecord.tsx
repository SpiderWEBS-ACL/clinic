import axios from "axios";
import { BASE_URL } from "../../BaseUrl";
import { config } from "../../../Middleware/authMiddleware";

export const addPatientHealthRecord = async (id: any, healtRecord: any) => {
  const response = await axios.post(
    `${BASE_URL}/doctor/addHealthRecordForPatient/${id}`,
    healtRecord,
    config
  );
  return response;
};
