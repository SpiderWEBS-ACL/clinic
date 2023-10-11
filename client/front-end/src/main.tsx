import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "../node_modules/bootstrap/dist/css/bootstrap.css";
import "./App.css";
import { BrowserRouter, BrowserRouter as Router } from "react-router-dom";
import AddAdminForm from "./pages/Admin/AddAdminForm";

import RegLog from "./pages/RegLog";


ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  
  
  <React.StrictMode>
      <BrowserRouter>
          <App />
      </BrowserRouter>
  </React.StrictMode>
);
