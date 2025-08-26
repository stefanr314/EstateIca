// import { createTheme, ThemeOptions } from "@mui/material/styles";
// import { PaletteColor } from "@mui/material";

// // Extend the Palette and PaletteOptions interfaces to include 'mint'
// declare module "@mui/material/styles" {
//   interface Palette {
//     mint?: PaletteColor;
//   }
//   interface PaletteOptions {
//     mint?: PaletteColor;
//   }
// }

// const themeOptions: ThemeOptions = {
//   palette: {
//     primary: {
//       main: "#05920c",
//     },
//     secondary: {
//       main: "#64dd17",
//     },
//     info: {
//       main: "#00c853",
//     },
//     error: {
//       main: "#ff1744",
//     },
//     warning: {
//       main: "#ff9100",
//     },
//     success: {
//       main: "#105417",
//     },
//     mint: {
//       main: "#ADEBB3",
//       light: "#dbffff",
//       dark: "#75ccb8",
//       contrastText: "#000000",
//     },
//     grey: {
//       50: "#fafafa", // Veoma svetla siva
//       100: "#f5f5f5", // Svetla siva
//       200: "#eeeeee", // Srednje svetla siva
//       300: "#e0e0e0", // Srednja siva
//       400: "#bdbdbd", // Srednje tamna siva
//       500: "#9e9e9e", // Tamna siva
//       600: "#757575", // Veoma tamna siva
//       700: "#616161", // Crna sa sivim tonom
//       800: "#424242", // Jako tamna siva
//       900: "#212121", // Gotovo crna
//     },
//   },
// };

// export const mainTheme = createTheme({
//   ...themeOptions,
//   colorSchemes: {
//     dark: {
//       palette: {
//         mode: "dark",
//         primary: { main: "#926105ff" },
//         mint: {
//           main: "#ADEBB3",
//           light: "#dbffff",
//           dark: "#75ccb8",
//           contrastText: "#000",
//         },
//         background: { default: "#121212", paper: "#1e1e1e" },
//       },
//     },
//   },
// });
// export const getTheme = (mode: "light" | "dark") =>
//   createTheme({
//     palette: {
//       mode,
//       primary: {
//         main: "#05920c",
//       },
//       secondary: {
//         main: "#64dd17",
//       },
//       info: {
//         main: "#00c853",
//       },
//       error: {
//         main: "#ff1744",
//       },
//       warning: {
//         main: "#ff9100",
//       },
//       success: {
//         main: "#105417",
//       },
//       mint: {
//         main: "#ADEBB3",
//         light: "#dbffff",
//         dark: "#75ccb8",
//         contrastText: "#000000",
//       },
//       grey: {
//         50: "#fafafa",
//         100: "#f5f5f5",
//         200: "#eeeeee",
//         300: "#e0e0e0",
//         400: "#bdbdbd",
//         500: "#9e9e9e",
//         600: "#757575",
//         700: "#616161",
//         800: "#424242",
//         900: "#212121",
//       },
//       background: {
//         default: mode === "dark" ? "#121212" : "#fff",
//         paper: mode === "dark" ? "#1e1e1e" : "#fff",
//       },
//     },
//     colorSchemes: {
//       dark: true,
//     },
//   });
import { createTheme, alpha, PaletteMode, Shadows } from "@mui/material/styles";

declare module "@mui/material/Paper" {
  interface PaperPropsVariantOverrides {
    highlighted: true;
  }
}
declare module "@mui/material/styles" {
  interface ColorRange {
    50: string;
    100: string;
    200: string;
    300: string;
    400: string;
    500: string;
    600: string;
    700: string;
    800: string;
    900: string;
  }

  // interface PaletteColor extends ColorRange {}

  interface Palette {
    baseShadow: string;
  }
}

const defaultTheme = createTheme();

const customShadows: Shadows = [...defaultTheme.shadows];

export const brand = {
  50: "hsl(210, 100%, 95%)",
  100: "hsl(210, 100%, 92%)",
  200: "hsl(210, 100%, 80%)",
  300: "hsl(210, 100%, 65%)",
  400: "hsl(210, 98%, 48%)",
  500: "hsl(210, 98%, 42%)",
  600: "hsl(210, 98%, 55%)",
  700: "hsl(210, 100%, 35%)",
  800: "hsl(210, 100%, 16%)",
  900: "hsl(210, 100%, 21%)",
};

export const gray = {
  50: "hsl(220, 35%, 97%)",
  100: "hsl(220, 30%, 94%)",
  200: "hsl(220, 20%, 88%)",
  300: "hsl(220, 20%, 80%)",
  400: "hsl(220, 20%, 65%)",
  500: "hsl(220, 20%, 42%)",
  600: "hsl(220, 20%, 35%)",
  700: "hsl(220, 20%, 25%)",
  800: "hsl(220, 30%, 6%)",
  900: "hsl(220, 35%, 3%)",
};

export const green = {
  50: "hsl(125, 80%, 96%)",
  100: "hsl(125, 75%, 91%)",
  200: "hsl(125, 70%, 83%)",
  300: "hsl(125, 65%, 68%)",
  400: "hsl(125, 60%, 52%)", // primarna (rich green)
  500: "hsl(125, 60%, 42%)", // dugmad
  600: "hsl(125, 65%, 35%)", // hover
  700: "hsl(125, 70%, 27%)",
  800: "hsl(125, 75%, 18%)",
  900: "hsl(125, 80%, 10%)",
};

export const mint = {
  50: "hsl(150, 80%, 95%)",
  100: "hsl(150, 75%, 90%)",
  200: "hsl(150, 70%, 80%)",
  300: "hsl(150, 65%, 70%)",
  400: "hsl(150, 60%, 60%)",
  500: "hsl(150, 55%, 50%)",
  600: "hsl(150, 50%, 40%)",
  700: "hsl(150, 45%, 30%)",
  800: "hsl(150, 40%, 20%)",
  900: "hsl(150, 35%, 10%)",
};

export const tealSoft = {
  50: "hsl(185, 80%, 95%)",
  100: "hsl(185, 75%, 90%)",
  200: "hsl(185, 65%, 80%)",
  300: "hsl(185, 60%, 68%)",
  400: "hsl(185, 55%, 55%)", // sekundarna
  500: "hsl(185, 50%, 45%)",
  600: "hsl(185, 55%, 35%)",
  700: "hsl(185, 60%, 25%)",
  800: "hsl(185, 65%, 15%)",
  900: "hsl(185, 70%, 10%)",
};

export const tealGray = {
  50: "hsl(185, 25%, 90%)",
  100: "hsl(185, 20%, 80%)",
  200: "hsl(185, 18%, 65%)",
  300: "hsl(185, 16%, 50%)", // najbolji kontrast za dark mode secondary.main
  400: "hsl(185, 15%, 40%)",
  500: "hsl(185, 14%, 30%)",
  600: "hsl(185, 12%, 25%)",
  700: "hsl(185, 10%, 20%)",
  800: "hsl(185, 9%, 15%)",
  900: "hsl(185, 8%, 10%)",
};

export const orange = {
  50: "hsl(30, 100%, 98%)",
  100: "hsl(30, 95%, 92%)",
  200: "hsl(30, 90%, 80%)",
  300: "hsl(30, 85%, 68%)", // svetlija, vesela
  400: "hsl(30, 85%, 55%)", // glavni ton za warning
  500: "hsl(30, 80%, 48%)", // main dugmadi/alerti
  600: "hsl(30, 75%, 42%)", // hover
  700: "hsl(30, 70%, 35%)",
  800: "hsl(30, 65%, 28%)",
  900: "hsl(30, 60%, 20%)",
};

export const red = {
  50: "hsl(0, 100%, 97%)",
  100: "hsl(0, 92%, 90%)",
  200: "hsl(0, 94%, 80%)",
  300: "hsl(0, 90%, 65%)",
  400: "hsl(0, 90%, 40%)",
  500: "hsl(0, 90%, 30%)",
  600: "hsl(0, 91%, 25%)",
  700: "hsl(0, 94%, 18%)",
  800: "hsl(0, 95%, 12%)",
  900: "hsl(0, 93%, 6%)",
};

export const getDesignTokens = (mode: PaletteMode) => {
  customShadows[1] =
    mode === "dark"
      ? "hsla(220, 30%, 5%, 0.7) 0px 4px 16px 0px, hsla(220, 25%, 10%, 0.8) 0px 8px 16px -5px"
      : "hsla(220, 30%, 5%, 0.07) 0px 4px 16px 0px, hsla(220, 25%, 10%, 0.07) 0px 8px 16px -5px";

  return {
    palette: {
      mode,
      primary: {
        light: green[200],
        main: green[400],
        dark: green[700],
        contrastText: green[50],
        ...(mode === "dark" && {
          contrastText: green[50],
          light: green[300],
          main: green[400],
          dark: green[700],
        }),
      },
      info: {
        main: tealSoft[300], // HSL(185, 16%, 50%)
        light: tealSoft[200],
        dark: tealSoft[400],
        contrastText: "#fff",
        ...(mode === "dark" && {
          main: mint[300],
          light: mint[200],
          dark: mint[400],
          contrastText: "#000",
        }),
      },
      warning: {
        light: orange[300],
        main: orange[400],
        dark: orange[800],
        ...(mode === "dark" && {
          light: orange[400],
          main: orange[500],
          dark: orange[700],
        }),
      },
      error: {
        light: red[300],
        main: red[400],
        dark: red[800],
        ...(mode === "dark" && {
          light: red[400],
          main: red[500],
          dark: red[700],
        }),
      },
      success: {
        light: green[300],
        main: green[400],
        dark: green[800],
        ...(mode === "dark" && {
          light: green[400],
          main: green[500],
          dark: green[700],
        }),
      },
      grey: {
        ...gray,
      },
      divider: mode === "dark" ? alpha(gray[700], 0.6) : alpha(gray[300], 0.4),
      background: {
        default: "hsl(0, 0%, 99%)",
        paper: "hsl(220, 35%, 97%)",
        ...(mode === "dark" && {
          default: gray[900],
          paper: "hsl(220, 30%, 7%)",
        }),
      },
      text: {
        primary: gray[800],
        secondary: gray[600],
        warning: orange[400],
        ...(mode === "dark" && {
          primary: "hsl(0, 0%, 100%)",
          secondary: gray[400],
        }),
      },
      action: {
        hover: alpha(gray[200], 0.2),
        selected: `${alpha(gray[200], 0.3)}`,
        ...(mode === "dark" && {
          hover: alpha(gray[600], 0.2),
          selected: alpha(gray[600], 0.3),
        }),
      },
    },
    typography: {
      fontFamily: "Inter, sans-serif",
      h1: {
        fontSize: defaultTheme.typography.pxToRem(48),
        fontWeight: 600,
        lineHeight: 1.2,
        letterSpacing: -0.5,
      },
      h2: {
        fontSize: defaultTheme.typography.pxToRem(36),
        fontWeight: 600,
        lineHeight: 1.2,
      },
      h3: {
        fontSize: defaultTheme.typography.pxToRem(30),
        lineHeight: 1.2,
      },
      h4: {
        fontSize: defaultTheme.typography.pxToRem(24),
        fontWeight: 600,
        lineHeight: 1.5,
      },
      h5: {
        fontSize: defaultTheme.typography.pxToRem(20),
        fontWeight: 600,
      },
      h6: {
        fontSize: defaultTheme.typography.pxToRem(18),
        fontWeight: 600,
      },
      subtitle1: {
        fontSize: defaultTheme.typography.pxToRem(18),
      },
      subtitle2: {
        fontSize: defaultTheme.typography.pxToRem(14),
        fontWeight: 500,
      },
      body1: {
        fontSize: defaultTheme.typography.pxToRem(14),
      },
      body2: {
        fontSize: defaultTheme.typography.pxToRem(14),
        fontWeight: 400,
      },
      caption: {
        fontSize: defaultTheme.typography.pxToRem(12),
        fontWeight: 400,
      },
    },
    shape: {
      borderRadius: 8,
    },
    shadows: customShadows,
  };
};

export const colorSchemes = {
  light: {
    palette: {
      primary: {
        light: green[200],
        main: green[400],
        dark: green[700],
        contrastText: green[50],
      },
      secondary: {
        light: tealSoft[200],
        main: tealSoft[400],
        dark: tealSoft[700],
        contrastText: tealSoft[50],
      },
      info: {
        // light: brand[100],
        // main: brand[300],
        // dark: brand[600],
        // contrastText: gray[50],
        main: tealSoft[300], // HSL(185, 16%, 50%)
        light: tealSoft[200],
        dark: tealSoft[400],
        contrastText: "#fff",
      },
      warning: {
        light: orange[300],
        main: orange[400],
        dark: orange[800],
      },
      error: {
        light: red[300],
        main: red[400],
        dark: red[800],
      },
      success: {
        light: green[300],
        main: green[400],
        dark: green[800],
      },
      grey: {
        ...gray,
      },
      divider: alpha(gray[300], 0.4),
      background: {
        default: "hsl(0, 0%, 99%)",
        paper: "hsl(220, 35%, 97%)",
      },
      text: {
        primary: gray[800],
        secondary: gray[600],
        warning: orange[400],
      },
      action: {
        hover: alpha(gray[200], 0.2),
        selected: `${alpha(gray[200], 0.3)}`,
      },
      baseShadow:
        "hsla(220, 30%, 5%, 0.07) 0px 4px 16px 0px, hsla(220, 25%, 10%, 0.07) 0px 8px 16px -5px",
    },
  },
  dark: {
    palette: {
      primary: {
        contrastText: green[50],
        light: green[300],
        main: green[400],
        dark: green[700],
      },
      secondary: {
        main: tealGray[300], // umirena teal
        light: tealGray[200],
        dark: tealGray[500],
      },
      info: {
        // contrastText: brand[300],
        // light: brand[500],
        // main: brand[700],
        // dark: brand[900],
        main: mint[300],
        light: mint[200],
        dark: mint[400],
        contrastText: "#000",
      },
      warning: {
        light: orange[400],
        main: orange[500],
        dark: orange[700],
      },
      error: {
        light: red[400],
        main: red[500],
        dark: red[700],
      },
      success: {
        light: green[400],
        main: green[500],
        dark: green[700],
      },
      grey: {
        ...gray,
      },
      divider: alpha(gray[700], 0.6),
      background: {
        default: gray[900],
        paper: "hsl(220, 30%, 7%)",
      },
      text: {
        primary: "hsl(0, 0%, 100%)",
        secondary: gray[400],
      },
      action: {
        hover: alpha(gray[600], 0.2),
        selected: alpha(gray[600], 0.3),
      },
      baseShadow:
        "hsla(220, 30%, 5%, 0.7) 0px 4px 16px 0px, hsla(220, 25%, 10%, 0.8) 0px 8px 16px -5px",
    },
  },
};

export const typography = {
  fontFamily: "Inter, sans-serif",
  h1: {
    fontSize: defaultTheme.typography.pxToRem(48),
    fontWeight: 600,
    lineHeight: 1.2,
    letterSpacing: -0.5,
  },
  h2: {
    fontSize: defaultTheme.typography.pxToRem(36),
    fontWeight: 600,
    lineHeight: 1.2,
  },
  h3: {
    fontSize: defaultTheme.typography.pxToRem(30),
    lineHeight: 1.2,
  },
  h4: {
    fontSize: defaultTheme.typography.pxToRem(24),
    fontWeight: 600,
    lineHeight: 1.5,
  },
  h5: {
    fontSize: defaultTheme.typography.pxToRem(20),
    fontWeight: 600,
  },
  h6: {
    fontSize: defaultTheme.typography.pxToRem(18),
    fontWeight: 600,
  },
  subtitle1: {
    fontSize: defaultTheme.typography.pxToRem(18),
  },
  subtitle2: {
    fontSize: defaultTheme.typography.pxToRem(14),
    fontWeight: 500,
  },
  body1: {
    fontSize: defaultTheme.typography.pxToRem(14),
  },
  body2: {
    fontSize: defaultTheme.typography.pxToRem(14),
    fontWeight: 400,
  },
  caption: {
    fontSize: defaultTheme.typography.pxToRem(12),
    fontWeight: 400,
  },
};

export const shape = {
  borderRadius: 8,
};

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const defaultShadows: Shadows = [
  "none",
  "var(--template-palette-baseShadow)",
  ...defaultTheme.shadows.slice(2),
];
export const shadows = defaultShadows;
