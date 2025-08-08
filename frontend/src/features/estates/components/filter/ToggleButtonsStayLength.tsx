import * as React from "react";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import HourglassBottomIcon from "@mui/icons-material/HourglassBottom";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";

interface Props {
  stayLength: string;
  setStayLength: (val: string) => void;
}

export default function ToggleButtonsStayLength({
  stayLength,
  setStayLength,
}: Props) {
  const handleChange = (
    event: React.MouseEvent<HTMLElement>,
    newValue: string | null
  ) => {
    if (newValue !== null) {
      setStayLength(newValue);
    }
  };

  return (
    <ToggleButtonGroup
      value={stayLength}
      exclusive
      onChange={handleChange}
      aria-label="Dužina boravka"
    >
      <Tooltip title="Bilo koja od dvije: kratkorocna ili dugorocna.">
        <ToggleButton value="any" aria-label="Bilo koja">
          <AccessTimeIcon color="primary" />
          <Typography variant="body2" pl={1}>
            Bilo koja
          </Typography>
        </ToggleButton>
      </Tooltip>
      <Tooltip title="Kratkoročni: Boravak do 28 dana.">
        <ToggleButton value="short-term" aria-label="Kratkoročni">
          <HourglassBottomIcon color="primary" />
          <Typography variant="body2" pl={1}>
            Kratkoročni
          </Typography>
        </ToggleButton>
      </Tooltip>
      <Tooltip title="Dugoročni: Boravak duži od 28 dana.">
        <ToggleButton value="long-term" aria-label="Dugoročni">
          <CalendarMonthIcon color="primary" />
          <Typography variant="body2" pl={1}>
            Dugoročni
          </Typography>
        </ToggleButton>
      </Tooltip>
    </ToggleButtonGroup>
  );
}
