import { createTheme, ThemeOptions } from "@mui/material/styles";
import { PaletteColor } from "@mui/material";

// Extend the Palette and PaletteOptions interfaces to include 'mint'
declare module "@mui/material/styles" {
  interface Palette {
    mint?: PaletteColor;
  }
  interface PaletteOptions {
    mint?: PaletteColor;
  }
}

const themeOptions: ThemeOptions = {
  palette: {
    mode: "light",
    primary: {
      main: "#05920c",
    },
    secondary: {
      main: "#64dd17",
    },
    info: {
      main: "#00c853",
    },
    error: {
      main: "#ff1744",
    },
    warning: {
      main: "#ff9100",
    },
    success: {
      main: "#105417",
    },
    mint: {
      main: "#ADEBB3",
      light: "#dbffff",
      dark: "#75ccb8",
      contrastText: "#000000",
    },
    grey: {
      50: "#fafafa", // Veoma svetla siva
      100: "#f5f5f5", // Svetla siva
      200: "#eeeeee", // Srednje svetla siva
      300: "#e0e0e0", // Srednja siva
      400: "#bdbdbd", // Srednje tamna siva
      500: "#9e9e9e", // Tamna siva
      600: "#757575", // Veoma tamna siva
      700: "#616161", // Crna sa sivim tonom
      800: "#424242", // Jako tamna siva
      900: "#212121", // Gotovo crna
    },
  },
};

export const mainTheme = createTheme(themeOptions);
