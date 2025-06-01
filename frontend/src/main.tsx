import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider as MUIProvider } from "./shared/ui/Provider.tsx";
// import App from "./app/App.tsx";
import AppRoutes from "./app/Routes.tsx";
// import "./challenge.ts";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <MUIProvider>
      <AppRoutes />
    </MUIProvider>
  </StrictMode>
);
