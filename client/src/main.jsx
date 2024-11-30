import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./theme/theme.js";
import "../src/styles/index.css";
import { Toaster } from "react-hot-toast";
// import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {/* <App /> */}
    <ThemeProvider theme={theme}>
      <App />
      <Toaster position="top-center" reverseOrder={false} />
    </ThemeProvider>
  </React.StrictMode>
);
