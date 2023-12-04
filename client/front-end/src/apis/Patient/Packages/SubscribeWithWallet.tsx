import axios from "axios";
import { headers } from "../../../Middleware/authMiddleware";
import { BASE_URL } from "../../BaseUrl";

export const subscribeWithWalletApi = async (id: any) => {
  const response = await axios.post(
    `${BASE_URL}/subscription/subscribeWallet/`,
    {
      packageId: id,
    },
    { headers: headers }
  );
};
