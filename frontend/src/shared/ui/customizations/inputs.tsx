import * as React from "react";
import { alpha, Theme, Components } from "@mui/material/styles";
import { outlinedInputClasses } from "@mui/material/OutlinedInput";
import { svgIconClasses } from "@mui/material/SvgIcon";
import { toggleButtonGroupClasses } from "@mui/material/ToggleButtonGroup";
import { toggleButtonClasses } from "@mui/material/ToggleButton";
import CheckBoxOutlineBlankRoundedIcon from "@mui/icons-material/CheckBoxOutlineBlankRounded";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import RemoveRoundedIcon from "@mui/icons-material/RemoveRounded";
import { gray, brand, green, tealSoft, mint } from "../theme";

/* eslint-disable import/prefer-default-export */
export const inputsCustomizations: Components<Theme> = {
  MuiButtonBase: {
    defaultProps: {
      disableTouchRipple: true,
      disableRipple: true,
    },
    styleOverrides: {
      root: ({ theme }) => ({
        boxSizing: "border-box",
        transition: "all 150ms ease-in-out",
        "&:focus-visible": {
          outline: `2px solid ${alpha(theme.palette.primary.main, 0.6)}`,
          outlineOffset: "2px",
        },
      }),
    },
  },
  MuiButton: {
    styleOverrides: {
      root: ({ theme }) => ({
        boxShadow: "none",
        borderRadius: (theme.vars || theme).shape.borderRadius,
        textTransform: "none",
        fontWeight: 600,
        variants: [
          {
            props: { size: "small" },
            style: {
              height: "2.25rem",
              padding: "6px 14px",
            },
          },
          {
            props: { size: "medium" },
            style: {
              height: "2.75rem",
              padding: "8px 20px",
            },
          },
          // PRIMARY CONTAINED
          {
            props: { color: "primary", variant: "contained" },
            style: {
              color: "#fff",
              backgroundColor: green[400],
              border: `1px solid ${green[500]}`,
              boxShadow: "none",
              transition:
                "background-color 150ms ease-in-out, border-color 150ms ease-in-out",
              "&:hover": {
                backgroundColor: green[500],
                borderColor: green[600],
                boxShadow: "none",
              },
              "&:active": {
                backgroundColor: green[600],
                borderColor: green[700],
                boxShadow: "none",
              },
              ...theme.applyStyles("dark", {
                color: green[50],
                backgroundColor: green[700],
                border: `1px solid ${green[600]}`,
                boxShadow: "none",
                "&:hover": {
                  backgroundColor: green[600],
                  borderColor: green[500],
                  boxShadow: "none",
                },
                "&:active": {
                  backgroundColor: green[800],
                  borderColor: green[700],
                  boxShadow: "none",
                },
              }),
            },
          },
          // SECONDARY CONTAINED (MINT)
          {
            props: { color: "secondary", variant: "contained" },
            style: {
              color: "#fff",
              backgroundColor: mint[400],
              backgroundImage: `linear-gradient(to bottom, ${mint[300]}, ${mint[500]})`,
              border: `1.5px solid ${mint[600]}`,
              boxShadow: `0 3px 8px ${alpha(mint[700], 0.4)}`,
              "&:hover": {
                backgroundColor: mint[500],
                backgroundImage: `linear-gradient(to bottom, ${mint[400]}, ${mint[600]})`,
                boxShadow: `0 4px 12px ${alpha(mint[800], 0.6)}`,
              },
              "&:active": {
                backgroundColor: mint[600],
                boxShadow: `inset 0 2px 5px ${alpha(mint[900], 0.8)}`,
              },
              ...theme.applyStyles("dark", {
                color: mint[50],
                backgroundColor: mint[700],
                backgroundImage: `linear-gradient(to bottom, ${mint[600]}, ${mint[800]})`,
                border: `1.5px solid ${mint[500]}`,
                boxShadow: `0 0 15px ${alpha(mint[400], 0.8)}`,
                "&:hover": {
                  backgroundColor: mint[600],
                  backgroundImage: `linear-gradient(to bottom, ${mint[500]}, ${mint[700]})`,
                  boxShadow: `0 0 20px ${alpha(mint[500], 0.9)}`,
                },
                "&:active": {
                  backgroundColor: mint[800],
                },
              }),
            },
          },
          // PRIMARY OUTLINED
          {
            props: { variant: "outlined", color: "primary" },
            style: {
              color: green[600],
              border: `1px solid ${green[200]}`,
              backgroundColor: "transparent",
              "&:hover": {
                backgroundColor: alpha(green[200], 0.3),
                borderColor: green[600],
              },
              "&:active": {
                backgroundColor: alpha(green[300], 0.4),
              },
              ...theme.applyStyles("dark", {
                color: green[300],
                borderColor: green[600],
                "&:hover": {
                  backgroundColor: alpha(green[800], 0.5),
                  borderColor: green[500],
                },
                "&:active": {
                  backgroundColor: alpha(green[700], 0.6),
                },
              }),
            },
          },
          // SECONDARY OUTLINED (MINT)
          {
            props: { variant: "outlined", color: "secondary" },
            style: {
              color: mint[600],
              border: `1.5px solid ${mint[300]}`,
              backgroundColor: "transparent",
              "&:hover": {
                backgroundColor: alpha(mint[200], 0.5),
                borderColor: mint[500],
              },
              "&:active": {
                backgroundColor: alpha(mint[300], 0.7),
              },
              ...theme.applyStyles("dark", {
                color: mint[300],
                borderColor: mint[700],
                "&:hover": {
                  backgroundColor: alpha(mint[700], 0.6),
                  borderColor: mint[600],
                },
                "&:active": {
                  backgroundColor: alpha(mint[800], 0.8),
                },
              }),
            },
          },
          // TEXT BUTTON PRIMARY
          {
            props: { variant: "text", color: "primary" },
            style: {
              color: green[600],
              "&:hover": {
                backgroundColor: alpha(green[100], 0.4),
              },
              "&:active": {
                backgroundColor: alpha(green[200], 0.5),
              },
              ...theme.applyStyles("dark", {
                color: green[300],
                "&:hover": {
                  backgroundColor: alpha(green[700], 0.5),
                },
                "&:active": {
                  backgroundColor: alpha(green[600], 0.7),
                },
              }),
            },
          },
          // TEXT BUTTON SECONDARY (MINT)
          {
            props: { variant: "text", color: "secondary" },
            style: {
              color: mint[600],
              "&:hover": {
                backgroundColor: alpha(mint[200], 0.4),
              },
              "&:active": {
                backgroundColor: alpha(mint[300], 0.6),
              },
              ...theme.applyStyles("dark", {
                color: mint[300],
                "&:hover": {
                  backgroundColor: alpha(mint[700], 0.5),
                },
                "&:active": {
                  backgroundColor: alpha(mint[800], 0.7),
                },
              }),
            },
          },
        ],
      }),
    },
  },
  MuiIconButton: {
    styleOverrides: {
      root: ({ theme }) => ({
        boxShadow: "none",
        borderRadius: (theme.vars || theme).shape.borderRadius,
        textTransform: "none",
        fontWeight: theme.typography.fontWeightMedium,
        letterSpacing: 0,
        color: (theme.vars || theme).palette.text.primary,
        border: "1px solid ",
        borderColor: gray[200],
        backgroundColor: alpha(gray[50], 0.3),
        "&:hover": {
          backgroundColor: gray[100],
          borderColor: gray[300],
        },
        "&:active": {
          backgroundColor: gray[200],
        },
        ...theme.applyStyles("dark", {
          backgroundColor: gray[800],
          borderColor: gray[700],
          "&:hover": {
            backgroundColor: gray[900],
            borderColor: gray[600],
          },
          "&:active": {
            backgroundColor: gray[900],
          },
        }),
        variants: [
          {
            props: {
              size: "small",
            },
            style: {
              width: "2.25rem",
              height: "2.25rem",
              padding: "0.25rem",
              [`& .${svgIconClasses.root}`]: { fontSize: "1rem" },
            },
          },
          {
            props: {
              size: "medium",
            },
            style: {
              width: "2.5rem",
              height: "2.5rem",
            },
          },
        ],
      }),
    },
  },
  MuiToggleButtonGroup: {
    styleOverrides: {
      root: ({ theme }) => ({
        borderRadius: "10px",
        boxShadow: `0 4px 16px ${alpha(gray[400], 0.2)}`,
        [`& .${toggleButtonGroupClasses.selected}`]: {
          color: green[500],
        },
        ...theme.applyStyles("dark", {
          [`& .${toggleButtonGroupClasses.selected}`]: {
            color: "#fff",
          },
          boxShadow: `0 4px 16px ${alpha(gray[700], 0.5)}`,
        }),
      }),
    },
  },
  MuiToggleButton: {
    styleOverrides: {
      root: ({ theme }) => ({
        padding: "12px 16px",
        textTransform: "none",
        borderRadius: "10px",
        fontWeight: 500,
        ...theme.applyStyles("dark", {
          color: gray[400],
          boxShadow: "0 4px 16px rgba(0, 0, 0, 0.5)",
          [`&.${toggleButtonClasses.selected}`]: {
            color: green[300],
          },
        }),
      }),
    },
  },
  MuiCheckbox: {
    defaultProps: {
      disableRipple: true,
      icon: (
        <CheckBoxOutlineBlankRoundedIcon
          sx={{ color: "hsla(210, 0%, 0%, 0.0)" }}
        />
      ),
      checkedIcon: <CheckRoundedIcon sx={{ height: 14, width: 14 }} />,
      indeterminateIcon: <RemoveRoundedIcon sx={{ height: 14, width: 14 }} />,
    },
    styleOverrides: {
      root: ({ theme }) => ({
        margin: 10,
        height: 16,
        width: 16,
        borderRadius: 5,
        border: "1px solid ",
        borderColor: alpha(gray[300], 0.8),
        boxShadow: "0 0 0 1.5px hsla(210, 0%, 0%, 0.04) inset",
        backgroundColor: alpha(gray[100], 0.4),
        transition: "border-color, background-color, 120ms ease-in",
        "&:hover": {
          borderColor: brand[300],
        },
        "&.Mui-focusVisible": {
          outline: `3px solid ${alpha(brand[500], 0.5)}`,
          outlineOffset: "2px",
          borderColor: brand[400],
        },
        "&.Mui-checked": {
          color: "white",
          backgroundColor: brand[500],
          borderColor: brand[500],
          boxShadow: `none`,
          "&:hover": {
            backgroundColor: brand[600],
          },
        },
        ...theme.applyStyles("dark", {
          borderColor: alpha(gray[700], 0.8),
          boxShadow: "0 0 0 1.5px hsl(210, 0%, 0%) inset",
          backgroundColor: alpha(gray[900], 0.8),
          "&:hover": {
            borderColor: brand[300],
          },
          "&.Mui-focusVisible": {
            borderColor: brand[400],
            outline: `3px solid ${alpha(brand[500], 0.5)}`,
            outlineOffset: "2px",
          },
        }),
      }),
    },
  },
  MuiInputBase: {
    styleOverrides: {
      root: {
        border: "none",
      },
      input: {
        "&::placeholder": {
          opacity: 0.7,
          color: gray[500],
        },
      },
    },
  },
  MuiOutlinedInput: {
    styleOverrides: {
      input: {
        padding: 0,
      },
      root: ({ theme }) => ({
        padding: "8px 12px",
        color: (theme.vars || theme).palette.text.primary,
        borderRadius: (theme.vars || theme).shape.borderRadius,
        border: `1px solid ${(theme.vars || theme).palette.divider}`,
        backgroundColor: (theme.vars || theme).palette.background.default,
        transition: "border 120ms ease-in",
        "&:hover": {
          borderColor: gray[400],
        },
        [`&.${outlinedInputClasses.focused}`]: {
          outline: `1px solid ${alpha(green[500], 0.5)}`,
          borderColor: green[400],
        },
        ...theme.applyStyles("dark", {
          "&:hover": {
            borderColor: gray[500],
          },
        }),
        variants: [
          {
            props: {
              size: "small",
            },
            style: {
              height: "2.25rem",
            },
          },
          {
            props: {
              size: "medium",
            },
            style: {
              height: "2.5rem",
            },
          },
        ],
      }),
      notchedOutline: {
        border: "none",
      },
    },
  },
  MuiInputAdornment: {
    styleOverrides: {
      root: ({ theme }) => ({
        color: (theme.vars || theme).palette.grey[500],
        ...theme.applyStyles("dark", {
          color: (theme.vars || theme).palette.grey[400],
        }),
      }),
    },
  },
  MuiFormLabel: {
    styleOverrides: {
      root: ({ theme }) => ({
        typography: theme.typography.caption,
        marginBottom: 8,
      }),
    },
  },
};
