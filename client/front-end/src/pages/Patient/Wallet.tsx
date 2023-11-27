import React, { useEffect, useState } from "react";
import WalletBalance from "../WalletBalance";
import axios from "axios";
import { config } from "../../Middleware/authMiddleware";
import { getBalance } from "../../apis/Patient/GetBalance";

const Wallet = () => {
  const [balance, setBalance] = useState<number>(0);
  const api = axios.create({
    baseURL: "http://localhost:8000/",
  });
  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const response = await getBalance();
        setBalance(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchBalance();
  });
  return <WalletBalance balance={balance} />;
};

export default Wallet;
