import * as React from "react";
import { styled } from "@mui/material/styles";
import Avatar from "@mui/material/Avatar";
import MuiDrawer, { drawerClasses } from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import SelectContent from "./SelectContent";
import MenuContent from "./MenuContent";
import CardAlert from "./CardAlert";
import OptionsMenu from "./OptionsMenu";
import Button from "@mui/material/Button";
import KeyboardArrowLeftRoundedIcon from "@mui/icons-material/KeyboardArrowLeftRounded";
import { NavLink, useNavigate } from "react-router-dom";
import { useAppSelector } from "@/app/store/hooks";
import { selectUser } from "@/features/auth/authSlice";

const drawerWidth = 240;

const Drawer = styled(MuiDrawer)({
  width: drawerWidth,
  flexShrink: 0,
  boxSizing: "border-box",
  mt: 10,
  [`& .${drawerClasses.paper}`]: {
    width: drawerWidth,
    boxSizing: "border-box",
  },
});

export default function SideMenu() {
  const navigate = useNavigate();
  const user = useAppSelector(selectUser);

  if (!user) return null;

  return (
    <Drawer
      variant="permanent"
      sx={{
        display: { xs: "none", md: "block" },
        [`& .${drawerClasses.paper}`]: {
          backgroundColor: "background.paper",
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          mt: "calc(var(--template-frame-height, 0px) + 4px)",
          p: 1.5,
        }}
      >
        {/* <SelectContent /> */}
        <Button
          component={NavLink}
          to="/"
          variant="outlined"
          color="secondary"
          startIcon={<KeyboardArrowLeftRoundedIcon />}
          sx={{
            justifyContent: "flex-start",
            fontWeight: 600,
            textTransform: "none",
            px: 2,
            py: 1.2,
            borderRadius: 2,
            width: "100%",
          }}
        >
          Return to home
        </Button>
      </Box>
      <Divider />
      <Box
        sx={{
          overflow: "auto",
          height: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <MenuContent />
        {/* <CardAlert /> */}
      </Box>
      <Stack
        direction="row"
        sx={{
          p: 2,
          gap: 1,
          alignItems: "center",
          borderTop: "1px solid",
          borderColor: "divider",
        }}
      >
        <Avatar
          sizes="small"
          alt={user.firstName}
          src={user.profilePicture}
          sx={{ width: 36, height: 36, cursor: "pointer" }}
          onClick={() => navigate("/dashboard/profile")}
        />
        <Box
          sx={{ mr: "auto", cursor: "pointer" }}
          onClick={() => navigate("/dashboard/profile")}
        >
          <Typography
            variant="body2"
            sx={{ fontWeight: 500, lineHeight: "16px" }}
          >
            {user.firstName} {user.lastName}
          </Typography>
          <Typography variant="caption" sx={{ color: "text.secondary" }}>
            {user.email}
          </Typography>
        </Box>
        <OptionsMenu />
      </Stack>
    </Drawer>
  );
}
