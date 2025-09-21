import type {} from "@mui/x-date-pickers/themeAugmentation";
import type {} from "@mui/x-charts/themeAugmentation";
import type {} from "@mui/x-data-grid/themeAugmentation";
import type {} from "@mui/x-tree-view/themeAugmentation";
import { alpha } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import AppNavbar from "./components/AppNavbar";
import Header from "./components/Header";
import SideMenu from "./components/SideMenu";

import {
  chartsCustomizations,
  dataGridCustomizations,
  datePickersCustomizations,
  treeViewCustomizations,
} from "./theme/customizations";
import { Outlet } from "react-router";
import { useSelector } from "react-redux";
import { selectUser, verificationSender } from "../auth/authSlice";
import { useAppDispatch, useAppSelector } from "@/app/store/hooks";
import { pushNotification } from "../notifications/notificationSlice";
import { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";

const xThemeComponents = {
  ...chartsCustomizations,
  ...dataGridCustomizations,
  ...datePickersCustomizations,
  ...treeViewCustomizations,
};

export default function Dashboard() {
  const currentUser = useSelector(selectUser);
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);

  const [open, setOpen] = useState(false);

  if (!user) return null;

  useEffect(() => {
    if (currentUser && !currentUser.isVerified) {
      setOpen(true);
      // dispatch(pushNotification(...))
    }
  }, [currentUser]);

  const handleClick = async () => {
    try {
      await dispatch(verificationSender({ email: user.email })).unwrap();
      dispatch(
        pushNotification({
          type: "info",
          message: "Provjerite svoj email i kliknite na verifikacioni link.",
        })
      );
    } catch (err) {
      dispatch(
        pushNotification({
          type: "error",
          message: "Slanje verifikacionog maila nije uspjelo.",
        })
      );
    }
  };

  function handleClose() {
    setOpen(false);
  }
  return (
    <>
      <Box sx={{ display: "flex" }}>
        <SideMenu />
        <AppNavbar />
        {/* Main content */}
        <Box
          component="main"
          sx={(theme) => ({
            flexGrow: 1,
            backgroundColor: theme.vars
              ? `rgba(${theme.vars.palette.background.defaultChannel} / 1)`
              : alpha(theme.palette.background.default, 1),
            overflow: "auto",
          })}
        >
          <Stack
            spacing={2}
            sx={{
              alignItems: "center",
              mx: 3,
              pb: 5,
              mt: { xs: 8, md: 0 },
            }}
          >
            <Header />
            {/* <MainGrid /> */}
            <Outlet />
          </Stack>
        </Box>
      </Box>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Verifikujte svoj nalog"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Vas nalog trenutno nije verifikovan. Kako biste mogli koristiti sve
            funkcionalnosti, molimo Vas da verifikujete svoj nalog.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Verifikuj poslije</Button>
          <Button onClick={handleClick}>Verifikuj</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
