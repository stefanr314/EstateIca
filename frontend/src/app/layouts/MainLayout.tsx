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
import ElevateAppBar from "@/shared/components/ElevateAppBar";
import CustomAppBar from "@/shared/components/StyledAppBar";

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
          marginTop: 8, // Add marginTop to avoid content being hidden by AppBar
          width: "100%",
          // maxWidth: "xl",
        }}
      >
        <Container>
          <Typography variant="h4" gutterBottom>
            Welcome to the App!
          </Typography>
          <Typography paragraph>
            This is an example of a simple App Layout using Material UI and
            React.
          </Typography>
        </Container>

        <Container>
          <Box sx={{ my: 2 }}>
            {[...new Array(32)]
              .map(
                () => `Cras mattis consectetur purus sit amet fermentum.
Cras justo odio, dapibus ac facilisis in, egestas eget quam.
Morbi leo risus, porta ac consectetur ac, vestibulum at eros.
Praesent commodo cursus magna, vel scelerisque nisl consectetur et.`
              )
              .join("\n")}
          </Box>
        </Container>
        <Container maxWidth="xl">
          <Outlet />
        </Container>
      </Box>
    </Box>
  );
}

export default MainLayout;
