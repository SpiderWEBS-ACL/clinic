import axios from "axios";
import { BASE_URL } from "../../BaseUrl";
import { headers } from "../../../Middleware/authMiddleware";

export const addAppointmentPatient = async (
  DoctorId: any,
  AppointmentDate: any,
  FamilyMember: any
) => {
  const response = await axios.post(
    `${BASE_URL}/appointment/add`,
    {
      Doctor: DoctorId,
      AppointmentDate: AppointmentDate,
      FamilyMember: FamilyMember,
    },
    { headers: headers }
  );
  return response;
};
