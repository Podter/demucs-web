import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import App from "./app";

const rootElement = document.getElementById("root");

if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
} else {
  console.error("No root element found");
}
