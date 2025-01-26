import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

const rootElement = document.getElementById("root");

if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <h1>Hello, world!</h1>
    </StrictMode>,
  );
} else {
  console.error("No root element found");
}
