import { useEffect, useState } from "react";
import WalletBalance from "../WalletBalance";
import { getBalance } from "../../apis/Patient/GetBalance";

const Wallet = () => {
  const [balance, setBalance] = useState<number>(0);
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
