import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { AppTheme as MUIProvider } from "./shared/ui/Provider.tsx";
import { Provider as ReduxProvider } from "react-redux";
import { store } from "./app/store/store.ts";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { ErrorBoundary } from "react-error-boundary"; //Does not work with React Router v6
// import App from "./app/App.tsx";
import AppRoutes from "./app/Routes.tsx";
import { APIProvider } from "@vis.gl/react-google-maps";
import { ToastManager } from "./features/notifications/components/ToastMenager.tsx";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

// This code is only for TypeScript
declare global {
  interface Window {
    __TANSTACK_QUERY_CLIENT__: import("@tanstack/query-core").QueryClient;
  }
}

// This code is for all users
window.__TANSTACK_QUERY_CLIENT__ = queryClient;

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ReduxProvider store={store}>
      <QueryClientProvider client={queryClient}>
        <APIProvider
          apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
          libraries={["places"]}
        >
          <MUIProvider>
            <ToastManager />
            <AppRoutes />
          </MUIProvider>
        </APIProvider>
      </QueryClientProvider>
    </ReduxProvider>
  </StrictMode>
);
