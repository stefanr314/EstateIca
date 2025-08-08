import React from "react";
import { Fab, Zoom, useScrollTrigger } from "@mui/material";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

const ScrollToTopFab: React.FC = () => {
  const trigger = useScrollTrigger({
    threshold: 100,
    disableHysteresis: true,
  });

  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <Zoom in={trigger}>
      <Fab
        onClick={handleClick}
        color="primary"
        size="medium"
        sx={{
          position: "fixed",
          bottom: 32,
          right: 32,
          zIndex: 1000,
          display: { xs: "none", sm: "flex" },
        }}
        aria-label="scroll back to top"
      >
        <KeyboardArrowUpIcon />
      </Fab>
    </Zoom>
  );
};

export default ScrollToTopFab;
