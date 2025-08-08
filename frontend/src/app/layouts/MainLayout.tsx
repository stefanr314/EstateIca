import { useState } from "react";
import {
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  Container,
  Box,
  Typography,
} from "@mui/material";
import { Outlet } from "react-router";
// import ElevateAppBar from "@/shared/components/ElevateAppBar";
import CustomAppBar from "@/shared/components/StyledAppBar";
import ScrollToTopFab from "@/shared/components/ScrollToTopFab";

function MainLayout() {
  const [open, setOpen] = useState(false);

  const toggleDrawer = () => setOpen(!open);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      {/* Header */}
      {/* <ElevateAppBar onMenuClick={toggleDrawer} /> */}
      <CustomAppBar onMenuClick={toggleDrawer} />

      {/* Drawer */}
      <Drawer anchor="left" open={open} onClose={toggleDrawer}>
        <List>
          <ListItemButton onClick={toggleDrawer}>
            <ListItemText primary="Home" />
          </ListItemButton>
          <ListItemButton onClick={toggleDrawer}>
            <ListItemText primary="About" />
          </ListItemButton>
          {/* Add more items here */}
        </List>
      </Drawer>

      {/* Main content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: "background.default",
          p: 3,
          // Dinamički marginTop koji se prilagođava visini AppBar-a
          marginTop: {
            xs: "8rem", // FullAppBar visina na mobilnim
            sm: "8rem", // FullAppBar visina na tablet
          },
          width: "100%",
          // maxWidth: "xl",
        }}
      >
        <Container maxWidth="xl">
          <Outlet />
        </Container>
      </Box>

      {/* Scroll to top button */}
      <ScrollToTopFab />
    </Box>
  );
}

export default MainLayout;
