import React from "react";
import axios from "axios";

const CheckoutButton: React.FC = () => {
  const api = axios.create({
    baseURL: "http://localhost:8000/",
  });

  const redirectToStripe = async () => {
    try {
      const items = [
        { id: 1, quantity: 2 },
        { id: 2, quantity: 3 },
      ];
      try {
        const response = await api.post("create-checkout-session", {
          items: items,
        });
        window.location.href = response.data.url;
      } catch (error) {
        console.log(error);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <button onClick={redirectToStripe} className="btn btn-primary">
      Checkout
    </button>
  );
};

export default CheckoutButton;
