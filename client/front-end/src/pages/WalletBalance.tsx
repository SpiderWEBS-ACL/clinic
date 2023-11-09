import React from "react";
import { Card, CardContent, Typography } from "@mui/material";

interface WalletBalanceProps {
  balance: number;
}

const WalletBalance: React.FC<WalletBalanceProps> = ({ balance }) => {
  return (
    <Card
      sx={{
        maxWidth: 400,
        margin: "50px auto",
        textAlign: "center",
        padding: 3,
      }}
    >
      <CardContent>
        <Typography variant="h4" color="text.primary" gutterBottom>
          Wallet
        </Typography>
        <Typography variant="h5" color="green">
          Balance: ${balance}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default WalletBalance;
