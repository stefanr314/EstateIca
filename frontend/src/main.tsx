import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { AppTheme as MUIProvider } from "./shared/ui/Provider.tsx";
import { Provider as ReduxProvider } from "react-redux";
import { store } from "./app/store/store.ts";
// import { ErrorBoundary } from "react-error-boundary"; //Does not work with React Router v6
// import App from "./app/App.tsx";
import AppRoutes from "./app/Routes.tsx";
import { ToastManager } from "./features/notifications/components/ToastMenager.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ReduxProvider store={store}>
      <MUIProvider>
        <ToastManager />
        <AppRoutes />
      </MUIProvider>
    </ReduxProvider>
  </StrictMode>
);
