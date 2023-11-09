import React from "react";
import {
  Button,
  Container,
  Typography,
  createTheme,
  ThemeProvider,
} from "@mui/material";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1976D2",
    },
    secondary: {
      main: "#F50057",
    },
  },
});

const PaymentPage: React.FC = () => {
  const handlePaymentOption = (option: "card" | "wallet") => {};

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="sm">
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography variant="h4" component="h1" gutterBottom>
            Choose a Payment Option
          </Typography>
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={() => handlePaymentOption("card")}
            style={{ marginBottom: "20px" }}
          >
            Card Payment
          </Button>
          <Button
            variant="contained"
            color="secondary"
            size="large"
            onClick={() => handlePaymentOption("wallet")}
          >
            Wallet Payment
          </Button>
        </div>
      </Container>
    </ThemeProvider>
  );
};

export default PaymentPage;
