import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import GavelIcon from "@mui/icons-material/Gavel";
import SentimentSatisfiedAltIcon from "@mui/icons-material/SentimentSatisfiedAlt";
import ThumbsUpDownIcon from "@mui/icons-material/ThumbsUpDown";
import NotInterestedIcon from "@mui/icons-material/NotInterested";
import Tooltip from "@mui/material/Tooltip";
import AllInclusiveIcon from "@mui/icons-material/AllInclusive";

type Props = {
  value: string | null;
  onChange: (value: string | null) => void;
};

export default function CancelPolicyToggleGroup({ value, onChange }: Props) {
  const handleChange = (
    _: React.MouseEvent<HTMLElement>,
    newValue: string | null
  ) => {
    onChange(newValue);
  };

  return (
    <ToggleButtonGroup
      value={value}
      exclusive
      onChange={handleChange}
      aria-label="cancellation policy"
      fullWidth
    >
      <Tooltip title="All: No cancellation policy selected.">
        <ToggleButton value="all" aria-label="all">
          <AllInclusiveIcon />
        </ToggleButton>
      </Tooltip>
      <Tooltip title="Strict: Full refund within 48 hours of booking, except for the first night and service fee.">
        <ToggleButton value="strict" aria-label="strict">
          <GavelIcon />
        </ToggleButton>
      </Tooltip>
      <Tooltip title="Moderate: Full refund within 5 days of booking, except for the first night and service fee.">
        <ToggleButton value="moderate" aria-label="moderate">
          <ThumbsUpDownIcon />
        </ToggleButton>
      </Tooltip>
      <Tooltip title="Flexible: Full refund within 1 day of booking, except for the first night and service fee.">
        <ToggleButton value="flexible" aria-label="flexible">
          <SentimentSatisfiedAltIcon />
        </ToggleButton>
      </Tooltip>
      <Tooltip title="No refund: No refund available.">
        <ToggleButton value="none" aria-label="none">
          <NotInterestedIcon />
        </ToggleButton>
      </Tooltip>
    </ToggleButtonGroup>
  );
}
