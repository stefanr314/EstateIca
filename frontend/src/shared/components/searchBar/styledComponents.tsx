import { mainTheme } from "@/shared/ui/theme";
import {
  Box,
  IconButton,
  Input,
  InputAdornment,
  Paper,
  styled,
} from "@mui/material";
import { ClearIcon } from "@mui/x-date-pickers";

const StyledPaper = styled(Paper)(() => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  flexWrap: "wrap",
  padding: "0 8px",
  width: "100%",
  maxWidth: 700,
  margin: "0 auto",
  borderRadius: 35,
}));

const StyledBox = styled(Box)(() => ({
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "start",
  padding: "4px 8px",
  borderRadius: 25,
  height: "4rem",
  cursor: "pointer",
  position: "relative",
  flex: 1,
  "&:not(:last-child)::after": {
    content: '""',
    position: "absolute",
    top: 15,
    right: 0,
    width: "1px",
    height: "50%",
    backgroundColor: mainTheme.palette.grey[400],
  },
  "&:hover": {
    backgroundColor: mainTheme.palette.grey[300],
  },
  "& > :first-child": {
    color: mainTheme.palette.primary.light,
    fontSize: "0.95rem",
    fontWeight: 500,
  },
  "& > :nth-child(2)": {
    fontSize: "0.85rem",
    fontWeight: 300,
    color: "rgba(0, 0, 0, 0.5)",
  },
}));

const DateInput = ({
  label,
  date,
  onClick,
  onClear,
}: {
  label: string;
  date: Date | null;
  onClick: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  onClear: () => void;
}) => (
  <StyledBox onClick={onClick}>
    <Box>{label}</Box>
    <Input
      readOnly
      value={date?.toLocaleDateString() || ""}
      placeholder="Izaberi datum"
      disableUnderline
      fullWidth
      endAdornment={
        date && (
          <InputAdornment position="end">
            <IconButton
              onClick={onClear}
              size="small"
              sx={{ margin: 0, padding: 0.1 }}
            >
              <ClearIcon sx={{ fontSize: 17 }} />
            </IconButton>
          </InputAdornment>
        )
      }
      sx={{
        input: {
          cursor: "pointer",
          "&:focus": {
            caretColor: "transparent",
          },
        },
      }}
    />
  </StyledBox>
);

export { DateInput, StyledPaper, StyledBox };
