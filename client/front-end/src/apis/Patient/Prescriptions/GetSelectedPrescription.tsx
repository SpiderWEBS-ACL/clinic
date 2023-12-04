import axios from "axios";
import { BASE_URL } from "../../BaseUrl";

export const getSelectedPrescription = async (prescId: any) => {
  const response = await axios.get(
    `${BASE_URL}/patient/selectPrescription/${prescId}`
  );
  return response;
};
