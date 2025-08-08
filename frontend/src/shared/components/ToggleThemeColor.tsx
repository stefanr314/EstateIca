import { FormControl, FormControlLabel, useColorScheme } from "@mui/material";
import MaterialUISwitch from "./MUIThemeSwitch";
function ToggleThemeColor() {
  const { mode, setMode } = useColorScheme();

  const handleChange = () => {
    setMode(mode === "light" ? "dark" : "light");
  };

  if (!mode) return null;

  return (
    <FormControl>
      <FormControlLabel
        control={
          <MaterialUISwitch checked={mode === "dark"} onChange={handleChange} />
        }
        label="Theme"
      />
    </FormControl>
  );
}

export default ToggleThemeColor;
