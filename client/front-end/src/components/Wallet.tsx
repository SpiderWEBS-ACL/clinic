import { WalletOutlined } from "@ant-design/icons";
import React from "react";
import "../components/wallet.css";

interface WalletProps {
  walletBalance: any;
}

const Wallet: React.FC<WalletProps> = ({ walletBalance }) => {
  return (
    <div className="three-d-card">
      <div className="card-wrapper">
        <div className="card-face front">
          <div className="card-content">
            <div className="card-title">
              <WalletOutlined />
            </div>
            <div className="card-description">Wallet</div>
          </div>
        </div>
        <div className="card-face back">
          <div className="card-content">
            <div className="card-title">${walletBalance}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Wallet;
