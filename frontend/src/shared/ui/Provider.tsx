import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { mainTheme } from "./theme";

const Provider = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider theme={mainTheme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
};

export { Provider };
