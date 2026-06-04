import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./styles/variables.css";
import "./styles/reset.css";
import "./styles/global.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);

// O Service Worker é gerado e registrado automaticamente pelo
// vite-plugin-pwa (configurado em vite.config.js com registerType: "autoUpdate").
// Não precisamos mais do registro manual aqui.
