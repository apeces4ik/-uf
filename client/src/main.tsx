import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { GlobalFonts } from "./lib/fonts";

createRoot(document.getElementById("root")!).render(
  <>
    <GlobalFonts />
    <App />
  </>
);
